import Button from "@/common/components/Button";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeaderHome = () => {
  const router = useRouter();
  return (
    <header className="blog-header py-2">
      <div className="row flex-nowrap justify-content-between align-items-center">
        <div className="col-4 pt-1">
          <Link className="blog-header-logo" href="/">
            <img src="/img/logo.png" alt="AdminLTE Logo" width={60} height={40} />
          </Link>
        </div>
        <div className="col-8 d-flex justify-content-end align-items-center">
          <a className="text-muted" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mx-3"><circle cx="10.5" cy="10.5" r="7.5"></circle><line x1="21" y1="21" x2="15.8" y2="15.8"></line></svg>
          </a>
          <Button color="primary" outline className="btn-no-border">
            About tool
          </Button>
          <Button color="primary" outline className="btn-no-border" onClick={() => router.push('/login')}>
            Sign in <FontAwesomeIcon icon={faSignIn} />
          </Button>
        </div>
      </div>
    </header>
  )
}
export default HeaderHome;