import { Star, Quote } from "lucide-react";

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

const Reviews = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
            <Star className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">4.9/5 from 2,000+ reviews</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from traders across Africa who buy and sell gift cards with gXchange.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:shadow-medium transition-shadow duration-200"
            >
              <Quote className="w-6 h-6 text-primary/40 mb-4" />
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-secondary fill-secondary" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{review.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
