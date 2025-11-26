import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bottom-sticky text-center bg-white sticky bottom-0 z-30">
      <section id="bottom-navigation" className="block fixed bottom-0 z-10 bg-white shadow w-full xl-max-w-screen-xl">
        <div className="container">
          <div id="tabs" className="d-flex justify-between border-t">
            <Link href="/" aria-current="page" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1 nuxt-link-exact-active nuxt-link-active">
              <i className="bi bi-house-door"></i>
              <span className="tab tab-home block text-xs">Home</span>
            </Link>
            <Link href="/" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1">
              <i className="bi bi-heart"></i>
              <span className="tab tab-home block text-xs">Favorites</span>
            </Link>
            <Link href="/" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1">
              <i className="bi bi-phone"></i>
              <span className="tab tab-home block text-xs">Contact Us</span>
            </Link>
            <Link href="/" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1">
              <i className="bi bi-person"></i>
              <span className="tab tab-home block text-xs">My Account</span>
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
