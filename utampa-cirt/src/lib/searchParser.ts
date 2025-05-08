import { Prisma } from "@prisma/client";

export function parseQueryToPrismaFilter(
  query: string
): Prisma.ArticleWhereInput {
  const tokens = query.match(/"[^"]+"|\(|\)|\bAND\b|\bOR\b|\w+/gi) ?? [];

  let index = 0;

  function parseExpression(): Prisma.ArticleWhereInput {
    const stack: Prisma.ArticleWhereInput[] = [];
    let operator: "AND" | "OR" = "AND";

    while (index < tokens.length) {
      const token = tokens[index++].trim();

      if (token === "(") {
        const expr = parseExpression();
        stack.push(expr);
      } else if (token === ")") {
        break;
      } else if (/^AND$/i.test(token)) {
        operator = "AND";
      } else if (/^OR$/i.test(token)) {
        operator = "OR";
      } else {
        const term = token.replace(/"/g, "");
        const isExcluded = term.startsWith("-");
        const searchTerm = isExcluded ? term.substring(1) : term;

        const match: Prisma.ArticleWhereInput = {
          OR: [
            { paper_name: { contains: searchTerm, mode: "insensitive" } },
            {
              author: {
                OR: [
                  { f_name: { contains: searchTerm, mode: "insensitive" } },
                  { l_name: { contains: searchTerm, mode: "insensitive" } },
                ],
              },
            },
            {
              keywords: {
                some: {
                  keyword: { contains: searchTerm, mode: "insensitive" },
                },
              },
            },
          ],
        };

        // If the term is excluded, wrap it in a NOT condition
        if (isExcluded) {
          stack.push({ NOT: match });
        } else {
          stack.push(match);
        }
      }

      if (stack.length > 1 && (operator === "AND" || operator === "OR")) {
        const right = stack.pop()!;
        const left = stack.pop()!;
        stack.push({ [operator]: [left, right] });
      }
    }

    return stack[0];
  }

  return parseExpression();
}
