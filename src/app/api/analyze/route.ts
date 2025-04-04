import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30;

export async function GET(request: NextRequest,) {
    const {searchParams} = new URL(request.url)
    const url = searchParams.get("url")
    const apiKey = process.env.PAGE_SPEED_API_KEY
    if (!url) {
        return NextResponse.json ({error: "Missing url parameter"}, {status: 400})
    }

    try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
        )}&key=${apiKey}&category=performance&category=accessibility&category=seo&category=best-practices`; 
    
        const response = await fetch (apiUrl);
        const data = await response.json()
    
        return NextResponse.json (data.lighthouseResult);
    
    } catch (error) {
        console.error ("Error calling Lighthouse API Key", error);
        return NextResponse.json ({error: "Failed to fetch Lighthouse data"}, {status: 400})
    }

  }
