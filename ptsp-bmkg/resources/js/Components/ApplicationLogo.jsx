export default function ApplicationLogo(props) {
    return (
        <div className="flex flex-col items-center">
            <img 
                {...props} 
                src="/assets/img/logo_BMKG_resmi.png" 
                alt="Logo Instansi"
                className="h-14 w-auto drop-shadow-sm" 
            />
        </div>
    );
}