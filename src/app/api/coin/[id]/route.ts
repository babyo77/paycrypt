import { NextResponse } from "next/server";

const ALLOWED_COINS: Record<string, string> = {
  eth: "ethereum",
  sol: "solana",
  btc: "bitcoin",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function GET(_: Request, { params }: PageProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }

    if (!Object.keys(ALLOWED_COINS).includes(id)) {
      return NextResponse.json(
        {
          error: `Invalid cryptocurrency. Allowed options: ${Object.keys(
            ALLOWED_COINS
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const coinId = ALLOWED_COINS[id];

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-dbDWo79KW3Vhi7PVxdbHeeES",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
    const formattedData = {
      id: id,
      name: id,
      price: data[coinId]?.usd || 0,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(`Error fetching cryptocurrency price:`, error);
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency price" },
      { status: 500 }
    );
  }
}
