import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-[100vh] bg-black">
        <div className="w-1/2 h-full p-6">
      {children}
      </div>

      <div className="w-1/2 h-full p-6">
          <div className=" w-full h-full bg-white/10 rounded-4xl
        ">
          {/* <video
            autoPlay
            muted
            loop
            className="w-full h-full  rounded-4xl"
          >
            <source src="/3.mp4" type="video/mp4" />
          </video> */}
          <Image src="/login.jpg" alt="login" width={1000} height={1000} className="w-full h-full object-cover rounded-4xl" />
        </div>
        </div>
    </div>
  );
}