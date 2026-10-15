import { Star } from "lucide-react";

const reviews = [
  {
    name: "David M.",
    location: "Kampala, Uganda",
    rating: 5,
    text: "Sold an Amazon gift card and got paid within 10 minutes. The best rates I've found anywhere — highly recommended!",
  },
  {
    name: "Sarah K.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "I was skeptical at first, but gXchange is legit. Smooth process from start to finish and the payout was instant.",
  },
  {
    name: "James O.",
    location: "Mbarara, Uganda",
    rating: 5,
    text: "Customer support replied to my WhatsApp in minutes. Sold Steam cards multiple times now, never had an issue.",
  },
  {
    name: "Grace A.",
    location: "Dar es Salaam, Tanzania",
    rating: 4,
    text: "Easy to use and fair rates. The sell flow is straightforward and I received my payment the same day.",
  },
  {
    name: "Brian T.",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "Been using gXchange for 6 months. Fast payouts, honest rates, and no hidden fees. My go-to platform.",
  },
  {
    name: "Amina H.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Bought gift cards here too — great selection and the codes worked perfectly. Will definitely use again.",
  },
];

const Reviews = () => (
  <section className="home-reviews">
    <div className="container">
      <div className="home-section-header"><div><p className="home-label">The other side of the trade</p><h2 className="home-heading">Customer stories.</h2></div><p className="max-w-xs text-sm text-muted-foreground">Buying, selling, and getting a little more from every gift card.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
        {reviews.map(review => <figure key={review.name} className="home-review"><div className="flex gap-1 mb-5" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />)}</div><blockquote className="text-base leading-relaxed flex-1">“{review.text}”</blockquote><figcaption className="mt-6"><p className="text-sm font-semibold">{review.name}</p><p className="mt-1 text-xs text-muted-foreground">{review.location}</p></figcaption></figure>)}
      </div>
    </div>
  </section>
);
export default Reviews;
