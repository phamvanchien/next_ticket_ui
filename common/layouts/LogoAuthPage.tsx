import Link from "next/link";

const LogoAuthPage = () => {
  return (
    <div className="login-logo">
      <Link href="/">
        <img src="/img_posts/logo-3.png" alt="AdminLTE Logo" width={200} height={50} />
      </Link>
    </div>
  )
}
export default LogoAuthPage;