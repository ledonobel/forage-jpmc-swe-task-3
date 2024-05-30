import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_ask.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 0.5;
    const lowerBound = 0.5;// 0.5 is my estimated +/-10% of the 12 month historical average ratio.
    // Bounds Calculation are meant to represent dynamic bounds based on historical data or other factors,
    // ensure that the calculation logic is correct.
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
          serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
} // Overall, the method appears to effectively generate a row based on server response data,
// but it's important to verify its correctness and suitability for your specific use case.
