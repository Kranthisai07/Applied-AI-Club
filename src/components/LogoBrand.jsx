import './LogoBrand.css';

/**
 * LogoBrand — Pure brain-circuit icon, no background/border/text.
 * The PNG already has a transparent background.
 */
export default function LogoBrand({ size = 'small' }) {
    const dim = {
        icon: 32,
        small: 40,
        medium: 90,
        large: 130,
        hero: 200,
    };
    const px = dim[size] ?? dim.small;

    return (
        <img
            src="/assets/brand/Gemini_Generated_Image_dcrptcdcrptcdcrp-removebg-preview.png"
            alt="Applied AI Club"
            className={`logobrand logobrand--${size}`}
            width={px}
            height={px}
        />
    );
}
