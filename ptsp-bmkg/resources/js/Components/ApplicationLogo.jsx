export default function ApplicationLogo(props) {
    return (
        <div className="flex flex-col items-center">
            <img 
                {...props} 
                src="/assets/img/logo_bmkg.png" 
                alt="Logo Instansi"
                className="h-24 w-auto drop-shadow-sm" 
            />
        </div>
    );
}