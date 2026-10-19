import amazonCard from "@/assets/amazon-giftcard.jpg";
import starbucksCard from "@/assets/starbucks-giftcard.jpg";

export default function TradeIntro({ mode }: { mode: "buy" | "sell" }) {
  return (
    <div className="trade-intro">
      <p className="page-kicker">gXchange / {mode === "buy" ? "Buy" : "Sell"}</p>
      <h1>{mode === "buy" ? "Buy gift cards." : "Sell your gift cards."}</h1>
      <p className="trade-description">{mode === "buy" ? "Choose your brand. Find your price. Get something you’ll love." : "Put your unused cards to work. Choose a brand and see what your card is worth."}</p>
      <div className="trade-brand-images">
        <img src={amazonCard} alt="Amazon gift card" width={768} height={768} />
        <img src={starbucksCard} alt="Starbucks gift card" width={768} height={768} />
      </div>
    </div>
  );
}