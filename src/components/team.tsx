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
    name: "Siddhi Patil",
    role: "Founding Engineer",
    avatar:
      "https://logo-images.b-cdn.net/Screenshot%202025-04-07%20at%201.40.34%E2%80%AFAM.png",
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
    <section id="team" className="pb-12 md:pb-32">
      <div className="mx-auto max-w-5xl px-7 md:px-24 lg:px-0">
        <div className="mb-8">
          <h2 className=" text-4xl font-bold mb-4 lg:text-5xl">Our team</h2>
          <p className="text-muted-foreground">
            PayCrypt is a team of forward-thinking innovators passionate about
            reshaping the future of finance through secure and seamless crypto
            payment solutions.
          </p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-5">
            {members.map((member, index) => (
              <div key={index}>
                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                  <img
                    className="aspect-square rounded-full object-cover"
                    src={member.avatar}
                    alt={member.name}
                    height="460"
                    width="460"
                    loading="lazy"
                  />
                </div>
                <span className="mt-2 block text-sm">{member.name}</span>
                <span className="text-muted-foreground block text-xs">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
