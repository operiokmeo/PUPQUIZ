type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export default function ApplicationLogo(props: Props) {
    return (
        <img
            src="/images/LOGO.png"
            alt="PUPT Quiz Logo"
            {...props}
        />
    );
}
