import { Hyperliquid } from "hyperliquid";

const WALLET_ADDRESS = process.env.HYPERLIQUID_ADDRESS || "";
const PRIVATE_KEY = process.env.HYPERLIQUID_PRIVATE_KEY || "";

let sdkInstance: Hyperliquid | null = null;

export async function getHyperliquidSDK(): Promise<Hyperliquid> {
  if (!sdkInstance) {
    sdkInstance = new Hyperliquid({
      privateKey: PRIVATE_KEY,
      testnet: false,
      enableWs: false,
    });
    await sdkInstance.connect();
  }
  return sdkInstance;
}

export interface Position {
  asset: string;
  side: "LONG" | "SHORT";
  size: number;
  sizeDisplay: string;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  margin: number;
  unrealizedPnl: number;
}

export interface AccountState {
  totalPnl: number;
  totalPnlPercent: number;
  accountValue: number;
  marginUsed: number;
  freeCollateral: number;
  positions: Position[];
}

export interface UserFill {
  coin: string;
  side: "B" | "A";
  px: string;
  sz: string;
  time: number;
  fee: string;
  closedPnl: string;
  hash: string;
}

export async function getAccountState(): Promise<AccountState> {
  try {
    const sdk = await getHyperliquidSDK();
    
    const clearinghouseState = await sdk.info.perpetuals.getClearinghouseState(WALLET_ADDRESS);
    
    const positions: Position[] = [];
    let totalUnrealizedPnl = 0;
    
    if (clearinghouseState.assetPositions) {
      for (const assetPosition of clearinghouseState.assetPositions) {
        const pos = assetPosition.position;
        if (!pos || parseFloat(pos.szi) === 0) continue;
        
        const size = parseFloat(pos.szi);
        const entryPrice = parseFloat(pos.entryPx);
        const unrealizedPnl = parseFloat(pos.unrealizedPnl);
        const leverage = parseFloat(pos.leverage?.value || "1");
        const liquidationPx = pos.liquidationPx ? parseFloat(pos.liquidationPx) : 0;
        const marginUsed = parseFloat(pos.marginUsed || "0");
        
        const allMids = await sdk.info.allMids();
        const markPrice = parseFloat(allMids[pos.coin] || "0");
        
        const positionValue = Math.abs(size) * entryPrice;
        const pnlPercent = positionValue > 0 ? (unrealizedPnl / positionValue) * 100 * leverage : 0;
        
        totalUnrealizedPnl += unrealizedPnl;
        
        positions.push({
          asset: `${pos.coin}-PERP`,
          side: size > 0 ? "LONG" : "SHORT",
          size: Math.abs(size),
          sizeDisplay: `${Math.abs(size).toFixed(4)} ${pos.coin}`,
          leverage: leverage,
          entryPrice: entryPrice,
          markPrice: markPrice,
          pnl: unrealizedPnl,
          pnlPercent: pnlPercent,
          liquidationPrice: liquidationPx,
          margin: marginUsed,
          unrealizedPnl: unrealizedPnl,
        });
      }
    }
    
    const accountValue = parseFloat(clearinghouseState.marginSummary?.accountValue || "0");
    const marginUsed = parseFloat(clearinghouseState.marginSummary?.totalMarginUsed || "0");
    
    return {
      totalPnl: totalUnrealizedPnl,
      totalPnlPercent: accountValue > 0 ? (totalUnrealizedPnl / accountValue) * 100 : 0,
      accountValue: accountValue,
      marginUsed: marginUsed,
      freeCollateral: accountValue - marginUsed,
      positions: positions,
    };
  } catch (error) {
    console.error("Error fetching account state:", error);
    return {
      totalPnl: 0,
      totalPnlPercent: 0,
      accountValue: 0,
      marginUsed: 0,
      freeCollateral: 0,
      positions: [],
    };
  }
}

export async function getUserFills(limit: number = 20): Promise<UserFill[]> {
  try {
    const sdk = await getHyperliquidSDK();
    const fills = await sdk.info.getUserFills(WALLET_ADDRESS);
    return fills.slice(0, limit) as UserFill[];
  } catch (error) {
    console.error("Error fetching user fills:", error);
    return [];
  }
}

export async function getAllMids(): Promise<Record<string, string>> {
  try {
    const sdk = await getHyperliquidSDK();
    return await sdk.info.allMids();
  } catch (error) {
    console.error("Error fetching mids:", error);
    return {};
  }
}

export function getWalletAddress(): string {
  return WALLET_ADDRESS;
}