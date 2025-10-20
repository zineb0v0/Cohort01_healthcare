import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-[#00345d] text-white px-4">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <p className="text-3xl md:text-4xl mb-6 text-center font-bold">
        Oups ! Page introuvable.
      </p>
      <p className="text-center text-lg md:text-xl mb-8 max-w-lg">
        La page que vous recherchez a peut-être été supprimée, renommée, ou est temporairement indisponible.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-all"
      >
        <FaHome /> Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
