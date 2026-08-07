interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}

const SectionHeading = ({ title, subtitle, light, className = "" }: SectionHeadingProps) => (
  <div className={`text-center mb-12 ${className}`}>
    <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-3 ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    <div className="w-20 h-1 bg-secondary mx-auto mb-4 rounded-full" />
    {subtitle && (
      <p className={`max-w-2xl mx-auto font-body text-base ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
