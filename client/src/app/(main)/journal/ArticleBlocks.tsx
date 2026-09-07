import type { ArticleBlock } from "@/config/journal-articles";

// Server-rendered renderer for a static Journal article's body. Kept free of
// client code so the full text is in the initial HTML for search engines.
export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mt-10 space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-4 font-heading text-2xl leading-snug text-foreground md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p
                key={i}
                className="font-light leading-relaxed text-foreground/90 md:text-[17px]"
              >
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 font-light leading-relaxed text-foreground/90"
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-gold pl-6 font-heading text-xl italic leading-relaxed text-foreground md:text-2xl"
              >
                {block.text}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
