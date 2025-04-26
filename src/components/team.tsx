import { Button } from "@/components/ui/button";
import Link from "next/link";
const members = [
  {
    name: "Meyank Singh",
    role: "Founding Engineer",
    avatar: "https://avatars.githubusercontent.com/u/111943685?v=4",
  },
  {
    name: "Tanmay Singh",
    role: "Founding Engineer",
    avatar: "https://avatars.githubusercontent.com/u/144552425?v=4",
  },
  {
    name: "Zade",
    role: "Founding Engineer",
    avatar: "https://avatars.githubusercontent.com/u/78777405?v=4",
  },
  // {
  //   name: "",
  //   role: "Lawyer",
  //   avatar: "https://avatars.githubusercontent.com/u/111943685?v=4",
  // },
  // {
  //   name: "Aman Gupta",
  //   role: "Management",
  //   avatar: "https://avatars.githubusercontent.com/u/156652993?v=4",
  // },
];

export default function TeamSection() {
  return (
    <section
      id="team"
      className="py-12 bg-gradient-to-b from-background/50 to-muted/20"
    >
      <div className="px-4 md:px-6 max-w-5xl text-center mx-auto space-y-2">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-500 lg:text-5xl font-medium mb-2 sm:mb-4">
            Meet Our Team
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2 sm:px-0">
            PayCrypt is built by a dedicated team of entrepreneurs and engineers
            with expertise in crypto, payments and emerging market financial
            solutions.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-6">
            {members.map((member, index) => (
              <div key={index} className="group flex flex-col items-center">
                <div className="relative">
                  <div className="bg-background size-28 rounded-full border-2 border-primary/20 p-1 shadow-md overflow-hidden transition-all duration-300 group-hover:border-primary/70">
                    <img
                      className="aspect-square rounded-full object-cover"
                      src={member.avatar}
                      alt={member.name}
                      height="460"
                      width="460"
                      loading="lazy"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-base font-medium">{member.name}</h3>
                <p className="text-muted-foreground text-xs">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="bg-muted/50 rounded-lg p-4 max-w-md text-center">
              <p className="text-sm">
                We're expanding our team! If you're passionate about crypto
                payments and emerging markets, we'd love to hear from you.
              </p>
              <Link href="https://discord.gg/wy5vsBs6">
                <Button variant="outline" className="mt-3">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
