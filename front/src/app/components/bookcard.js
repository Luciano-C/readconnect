import Image from "next/image";
import Link from "next/link";

export const BookCard = ({ book }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 w-2/12 flex flex-col"> {/* Added flex and flex-col */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={book.thumbnailUrl} 
          alt={book.title} 
          width={500} 
          height={300}
          className="absolute top-50% left-50% transform -translate-x-50% -translate-y-50% w-full h-auto"
        />
      </div>
      <div className="px-6 py-4 flex-grow"> {/* Added flex-grow */}
        <div className="font-bold text-xl mb-2">{book.title}</div>
        <p className="text-gray-700 text-base">
          {book.shortDescription}
        </p>
      </div>
      <div className="px-6 py-4 flex-grow"> {/* Added flex-grow */}
        {book.categories.map((category, i) => (
          <span 
            key={`category-${i}`} 
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >
            {category.name}
          </span>
        ))}
      </div>
      <div className="px-6 py-4 flex justify-center">
        <Link href={`/book/${book._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Details
        </Link>
      </div>
    </div>
  );
}
