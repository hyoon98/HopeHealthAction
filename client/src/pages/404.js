import React,{useEffect} from 'react';
import CookieChecker from '../components/CookieChecker';

function NotFoundPage() {
  useEffect(() => {
    document.title="Not Found 404"
  }, [])
  return (
    <>
    <CookieChecker ></CookieChecker>
    <h1>Not Found!</h1>
    </>
  )
}

export default NotFoundPage;