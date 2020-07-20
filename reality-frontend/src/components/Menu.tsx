import Link from 'next/link';

const Menu = () => (
  <ul>
    <li>
      <Link
        href="index"
      >
        Home
      </Link>
    </li>
    <li>
      <Link
        href="contact"
      >
        Kontakty
      </Link>
    </li>
    <li>
      <Link
        href="contact"
      >
        Kontakty [en]
      </Link>
    </li>
    <li>
      <Link
        href="contact"
      >
        Kontakty
      </Link>
    </li>
    <li>
      <Link
        href="undefinedRoute"
      >
        undefinedRoute
      </Link>
    </li>
  </ul>
);

export {
  Menu,
};
