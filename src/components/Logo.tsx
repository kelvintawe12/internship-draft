interface LogoProps {
    className?: string;
  }
  
  const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 92C27.4 92 8 72.6 8 50S27.4 8 50 8s42 19.4 42 42-19.4 42-42 42z" />
      <path d="M35 35h30v30H35z" />
    </svg>
    );
  };
  
  export default Logo;