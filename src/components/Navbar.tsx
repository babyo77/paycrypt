import { IconActivity, IconCode, IconTransfer, IconBrandAirbnb } from '@tabler/icons-react';
import { Plus, Receipt, Settings, Settings2, User } from 'lucide-react';
import React from 'react'

const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconActivity,
        description: "Overview of balances and recent activity",
      },
  
      {
        title: "Transactions",
        url: "/transactions",
        icon: IconTransfer,
      },
  
      {
        title: "Payment",
        url: "/links",
        icon: Plus,
        items: [
          {
            title: "Create Payment Link",
            url: "/links/create",
          },
          {
            title: "Payment Links History",
            url: "/links/history",
          },
        ],
      },
      {
        title: "Developer",
        url: "/developer",
        icon: IconCode,
        items: [
          {
            title: "API keys",
            url: "/settings/api-keys",
          },
          {
            title: "Webhooks",
            url: "/settings/webhooks",
          },
          // {
          //   title: "SDK",
          //   url: "/settings/sdk",
          // },
          {
            title: "Documentation",
            url: "/docs",
          },
        ],
      },
      {
        title: "Payout",
        url: "/payout",
        icon: Receipt,
      },
      {
        title: "Integrations",
        url: "/integrations",
        icon: IconBrandAirbnb,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
      // {
      //   title: "Support & Help",
      //   url: "/support",
      //   icon: IconHelp,
      // },
    ],
  };

const Navbar = () => {
  return (
    <div className='w-full flex justify-between'
    style={{
        padding:"clamp(1rem,1.5vw,100rem) clamp(1rem,2vw,100rem)"
    }}
    >
        <div className="text-white text-4xl mgf">Paycrypt</div>

<div className="flex items-center gap-2">
        <div className="flex rounded-full gap-10 bg-black px-6 py-4">
            {data.navMain.map((item,index) => (
                <div className="flex items-center text-sm gap-2" key={index}>
                    <span>{item.title}</span>
                </div>
            ))}
        </div>

        <div className="flex items-center bg-black rounded-3xl px-4 h-full w-auto justify-center gap-2">
            <Settings className='size-5' />
            <span>Settings</span>
        </div>

        <div className="flex items-center bg-black rounded-3xl aspect-square h-full w-auto justify-center">
            <User />
        </div>
        </div>
      
    </div>
  )
}

export default Navbar
