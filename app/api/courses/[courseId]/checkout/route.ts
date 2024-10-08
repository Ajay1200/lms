import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { auth } from "@/auth"

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth()
    const email = session?.user?.email || ""
    const userId = session?.user?.id || ""

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    })

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        },
      },
    })

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 })
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "INR",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ]

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId,
      },
      select: {
        stripeCustomerId: true,
      },
    })

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: email,
        // name: userId,
      })

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId,
          stripeCustomerId: customer.id,
        },
      })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId,
      },
    })

    if (stripeSession) {
      await db.purchase.create({
        data: {
          userId,
          courseId: params.courseId,
        },
      })
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error: any) {
    console.log("COURSE_ID_CHECKOUT", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
