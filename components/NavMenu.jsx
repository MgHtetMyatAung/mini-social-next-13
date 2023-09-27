import Link from "next/link";
import React from "react";

function NavMenu() {
  return (
    <section className=" shadow">
      <nav className=" container mx-auto h-[60px] md:h-[70px] flex justify-between items-center">
        <h2 className=" uppercase text-lg md:text-xl font-bold text-green-700">Social</h2>
        <ul>
          <li className=" font-medium">
            <Link href={"/"}>Posts</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default NavMenu;
