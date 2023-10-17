import Image from 'next/image';

export const Loader = () => {
    return (
        <div  className="h-full flex flex-col gap-y-4 items-center">
            <div className="w-10 h-10 relative animate-spin">
                <Image
                alt="Logo"
                fill
                src="/loading.png"
                />
            </div>
            <p className='text-sm text-muted-foreground'>
                Distrix is thinking...
            </p>
        </div>
    )
}