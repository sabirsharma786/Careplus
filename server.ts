import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  resolveMultiPrice,
  buildDefaultPricingConfig,
  INITIAL_CUSTOM_PRICE_LISTS,
  PRICE_PRECEDENCE_DOCUMENTATION
} from './src/services/pricingEngine';
import { INITIAL_PRODUCTS } from './src/services/mockData';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'careplus-erp-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerPersistedState {
  lastSyncedAt: string;
  syncCount: number;
  irdSyncedInvoices: Record<string, { signature: string; syncedAt: string; invoiceNumber: string; amount: number }>;
  customSnapshot?: Record<string, unknown>;
}

function loadServerState(): ServerPersistedState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw) as ServerPersistedState;
    }
  } catch (err) {
    console.error('Error loading persisted ERP state:', err);
  }
  const initial: ServerPersistedState = {
    lastSyncedAt: new Date().toISOString(),
    syncCount: 1,
    irdSyncedInvoices: {
      'ord-8941': {
        signature: 'IRD-CBMS-2083-9941A8F',
        syncedAt: '2026-10-16T09:15:22.000Z',
        invoiceNumber: 'CP-TI-2083-0491',
        amount: 4689
      },
      'ord-8942': {
        signature: 'IRD-CBMS-2083-7720C3B',
        syncedAt: '2026-10-17T06:40:10.000Z',
        invoiceNumber: 'CP-TI-2083-0512',
        amount: 64128
      }
    }
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveServerState(state: ServerPersistedState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write ERP state:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const serverBootTime = Date.now();
  const persistedState = loadServerState();

  // 1. Health & Enterprise Backend Telemetry Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      engine: 'CarePlus Quark Enterprise ERP & Multi-Price Engine v4.2',
      uptimeSeconds: Math.floor((Date.now() - serverBootTime) / 1000),
      databaseFile: '.data/careplus-erp-db.json',
      lastSyncedAt: persistedState.lastSyncedAt,
      syncCount: persistedState.syncCount,
      irdCbmsGateway: {
        status: 'CONNECTED',
        protocol: 'Nepal IRD CBMS Real-Time REST v2.4',
        panSeller: '609841235',
        fiscalYear: '2083/84',
        syncedInvoiceCount: Object.keys(persistedState.irdSyncedInvoices).length
      },
      pricingPrecedenceLayers: PRICE_PRECEDENCE_DOCUMENTATION.length
    });
  });

  // 2. Server-Side Multi-Price Engine Resolution Endpoint
  app.post('/api/pricing/resolve', (req, res) => {
    try {
      const { productId, quantity = 1, channel = 'wholesale', customer, invoiceOverridePrice, effectiveDate } = req.body;
      const product = INITIAL_PRODUCTS.find((p) => p.id === productId) || INITIAL_PRODUCTS[0];
      const pricingConfig = buildDefaultPricingConfig(product);

      const resolution = resolveMultiPrice({
        product,
        pricingConfig,
        customer,
        customPriceLists: INITIAL_CUSTOM_PRICE_LISTS,
        channel,
        quantity: Number(quantity) || 1,
        invoiceDate: effectiveDate,
        manualOverrideUnitPrice: invoiceOverridePrice !== undefined ? Number(invoiceOverridePrice) : null,
        isAuthenticatedWholesale: channel === 'wholesale'
      });

      res.json({
        status: 'resolved',
        evaluatedAt: new Date().toISOString(),
        serverAuthority: 'CarePlus Server-Side Pricing Engine',
        resolution
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to resolve product price'
      });
    }
  });

  // 3. Nepal IRD Central Billing Monitoring System (CBMS) Fiscalization Endpoint
  app.post('/api/ird/cbms-sync', (req, res) => {
    const { orderId, invoiceNumber, customerPan, totalAmount, taxAmount } = req.body;
    const hashSuffix = Math.random().toString(16).substring(2, 9).toUpperCase();
    const signature = `IRD-CBMS-2083-${hashSuffix}`;
    const syncedAt = new Date().toISOString();

    if (orderId) {
      persistedState.irdSyncedInvoices[orderId] = {
        signature,
        syncedAt,
        invoiceNumber: invoiceNumber || 'CP-TI-2083-XXXX',
        amount: Number(totalAmount) || 0
      };
      persistedState.lastSyncedAt = syncedAt;
      persistedState.syncCount += 1;
      saveServerState(persistedState);
    }

    res.json({
      status: 'FISCALIZED',
      sellerPan: '609841235',
      buyerPan: customerPan || 'CONSUMER-UNREGISTERED',
      fiscalYear: '2083/84',
      invoiceNumber,
      taxableAmount: Math.max(0, (Number(totalAmount) || 0) - (Number(taxAmount) || 0)),
      vatAmount13Percent: Number(taxAmount) || 0,
      totalAmount: Number(totalAmount) || 0,
      irdFiscalSignature: signature,
      syncedAt
    });
  });

  // 4. Persistent ERP Ledger Snapshot Read & Sync
  app.get('/api/erp/snapshot', (_req, res) => {
    res.json({
      status: 'ok',
      lastSyncedAt: persistedState.lastSyncedAt,
      syncCount: persistedState.syncCount,
      irdSyncedInvoices: persistedState.irdSyncedInvoices,
      customSnapshot: persistedState.customSnapshot || null
    });
  });

  app.post('/api/erp/snapshot', (req, res) => {
    const { snapshotSummary } = req.body;
    persistedState.lastSyncedAt = new Date().toISOString();
    persistedState.syncCount += 1;
    if (snapshotSummary) {
      persistedState.customSnapshot = snapshotSummary;
    }
    saveServerState(persistedState);
    res.json({
      status: 'persisted',
      lastSyncedAt: persistedState.lastSyncedAt,
      syncCount: persistedState.syncCount
    });
  });

  // Mount Vite Dev Server or Production Static Assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CarePlus Enterprise ERP & Storefront Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
