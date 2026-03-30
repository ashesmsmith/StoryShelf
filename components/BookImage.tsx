import Image from 'next/image';

type BookImageProps = {
    src?: string;
    alt?: string;
    className?: string;
};

export default function BookImage({ src, alt, className }: BookImageProps) {
    return (
        <Image
            src={src || '/book_placeholder.png'}
            alt={alt || 'Book cover'}
            fill
            className={className}
            onError={(e) => {
                (e.target as HTMLImageElement).src = '/book_placeholder.png';
            }}
        />
    );
}
