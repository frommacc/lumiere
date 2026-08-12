import Image from 'next/image'
import ResetPasswordForm from './ResetPasswordForm'
import InvalidToken from './InvalidToken'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  return (
    <main className='flex min-h-screen flex-col md:flex-row bg-background text-foreground'>      {/* Left Side: Visual & Identity */}
      <section className='relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden'>
        <Image
          alt='Lumière Ambiance'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuDMjZ8JM3C73asUmtqpWnpAQt2ftc6z5yfSqfCql30aSkF8Z5xeXWc6KPrD_k2T4r5cPO54aAekyq0KzSy6jBFYOt_Zn3XXP7_gNGlNAe6wGWIvbJBTblLCQvb_NvJZD3z1u2g993djy6aqm_a7khsXqJgIYTImUpQsGh-TlI8-diKnmL1_WszMCVY_vuRZdBiLhVGQ81KAfztiaDRMzMpF5pQ-nJy4989c9tiA2CYnEyt6ySrSEsNxhskVpCKSCVhIMFNHxd_ORpI'
          fill
          priority
          className='object-cover grayscale-[0.3]'
        />
        <div className='absolute inset-0 bg-background/80'></div>
        <div className='relative z-10 h-full flex flex-col justify-between p-8 md:p-16'>
          <div className='flex items-center space-x-4'>
            <div className='h-px w-12 bg-primary'></div>
            <span className='text-xs font-semibold uppercase tracking-[0.3em] text-primary'>
              Lumière Architecture
            </span>
          </div>
          <div className='max-w-md my-auto py-12 md:py-0'>
            <h2 className='font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight'>              Secure your account.
            </h2>
            <p className='text-base md:text-lg text-outline'>              Choose a strong and unique password to protect your personal information
              data and orders.
            </p>
          </div>
          <div className='hidden md:block'>
            <span className='text-xs uppercase tracking-[0.5em] text-outline-variant'>
              The Aurelian Standard
            </span>
          </div>
        </div>
      </section>      {/* Right side: Form / Invalid Token state */}
      <section className='w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background'>
        <div className='w-full max-w-md'>
          {token ? <ResetPasswordForm token={token} /> : <InvalidToken />}
        </div>
      </section>
    </main>
  )
}
