"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import PrintFriendlyView from "@/components/article/PrintFriendlyView";
import ReadingModeView from "@/components/article/ReadingModeView";
import CollectionsButton from "@/components/article/CollectionsButton";
import ShareButton from "@/components/article/ShareButton";
import ReferenceExportButton from "@/components/article/ReferenceExportButton";
import { Printer, FileDown, FileText, Copy, BookOpen } from "lucide-react";

// This would come from your database in a real implementation
const getArticleById = (id: string) => {
  // Mock data - in a real app, fetch this from your Firebase database
  const articles = [
    {
      id: "1",
      title: "The Impact of Community Policing on Urban Crime Rates",
      author: "Dr. Sarah Johnson",
      coAuthors: ["Dr. Robert Smith", "Dr. Lisa Chen"],
      institution: "University of Tampa",
      publicationDate: "March 10, 2025",
      journal: "Journal of Criminal Justice",
      volume: "48",
      issue: "2",
      pages: "112-135",
      doi: "10.1234/jcj.2025.48.2.112",
      abstract:
        "This study examines the effectiveness of community policing strategies in major metropolitan areas over a five-year period. Using a mixed-methods approach, we analyze crime statistics from 15 urban centers before and after the implementation of various community policing initiatives. Our findings suggest that targeted community engagement programs led to a statistically significant reduction in violent crimes, particularly in neighborhoods with historically high crime rates. The study also identifies key success factors in community policing implementation and offers policy recommendations for law enforcement agencies.",
      keywords: [
        "community policing",
        "crime reduction",
        "urban crime",
        "law enforcement",
        "public safety",
      ],
      type: "Article",
      fullText:
        "## Introduction\n\nCommunity policing has emerged as a prominent strategy in law enforcement over the past several decades. The core philosophy behind community policing is that police effectiveness in reducing crime and addressing community problems depends on developing relationships with the community. This approach involves three key components: organizational transformation, community partnerships, and problem-solving activities.\n\n## Methodology\n\nThis study employed a mixed-methods approach to evaluate the impact of community policing strategies across 15 major metropolitan areas in the United States from 2020 to 2025. Quantitative data included crime statistics obtained from local police departments and the FBI's Uniform Crime Reports. Qualitative data was gathered through semi-structured interviews with 45 law enforcement officials and 120 community members.\n\n## Results\n\nOur analysis revealed that cities implementing comprehensive community policing strategies experienced a mean reduction of 18.7% in violent crimes over the five-year period, compared to a 7.3% reduction in control cities. Property crimes decreased by 12.4% in community policing cities versus 5.1% in control cities. Particularly notable was the reduction in crimes against persons in neighborhoods where foot patrols and community engagement programs were most active.\n\n## Discussion\n\nThe results suggest that community policing is most effective when it includes regular positive interactions between officers and community members, targeted problem-solving approaches, and organizational commitment to the philosophy. Cities that allocated resources to officer training in community engagement techniques showed the strongest results.\n\n## Conclusion\n\nThis study provides empirical support for the effectiveness of community policing in reducing urban crime rates. The findings suggest that law enforcement agencies should prioritize community engagement and problem-solving approaches, particularly in high-crime neighborhoods. Future research should explore the long-term sustainability of these crime reduction effects and examine how community policing can be tailored to different demographic and socioeconomic contexts.",
      references: [
        "Brown, L. P. (2023). Community Policing: A Contemporary Perspective. Journal of Police Science, 42(3), 311-328.",
        "Martinez, R., & Rodriguez, C. (2024). Building Trust: Police-Community Relations in Urban Settings. Urban Studies Review, 18(2), 95-112.",
        "Wilson, J. Q., & Kelling, G. L. (1982). Broken Windows: The Police and Neighborhood Safety. Atlantic Monthly, 249(3), 29-38.",
        "Taylor, S. J. (2022). Community Engagement and Crime Prevention: A Meta-Analysis. Criminology & Public Policy, 21(4), 567-589.",
        "Harris, D. A. (2023). Evaluating Police-Community Programs: Methodological Challenges. Journal of Criminal Justice, 46(1), 78-93.",
      ],
      downloads: [
        {
          label: "Full PDF",
          url: "#",
        },
        {
          label: "Supplementary Materials",
          url: "#",
        },
      ],
    },
    {
      id: "2",
      title: "Digital Forensics in Modern Criminal Investigations",
      author: "Prof. Michael Rodriguez",
      coAuthors: ["Dr. James Wilson", "Sarah Parker, M.S."],
      institution: "University of Tampa",
      publicationDate: "February 28, 2025",
      journal: "Digital Criminology Quarterly",
      volume: "37",
      issue: "1",
      pages: "64-83",
      doi: "10.3456/dcq.2025.37.1.64",
      abstract:
        "This article explores the evolution of digital forensic techniques and their application in solving complex criminal cases. We review advancements in data recovery, network analysis, and mobile device forensics over the past decade and present three case studies illustrating how these techniques have been crucial in resolving high-profile investigations. The paper also addresses emerging challenges related to encryption, cloud storage, and privacy laws, offering a framework for addressing these issues within the bounds of legal and ethical constraints.",
      keywords: [
        "digital forensics",
        "cybercrime",
        "data recovery",
        "criminal investigation",
        "electronic evidence",
      ],
      type: "Journal",
      fullText: "...", // Full text would be here
      references: [
        "Anderson, M. (2024). Modern Approaches to Digital Evidence Collection. Forensic Science International: Digital Investigation, 42, 301024.",
        "Brenner, S. W. (2023). Cybercrime: Criminal Threats from Cyberspace. Journal of Technology Law, 15(3), 201-218.",
        "Casey, E. (2022). Digital Evidence and Computer Crime. International Journal of Digital Forensics, 14(1), 12-35.",
        "Dhillon, G., & Margetts, R. (2024). Cloud Forensics: Challenges and Opportunities. Journal of Information Security, 18(2), 156-172.",
        "Edwards, K., & Fitzgerald, S. (2023). Mobile Device Forensics: Evolving Techniques and Standards. Digital Investigation, 39, 200912.",
      ],
      downloads: [
        {
          label: "Full PDF",
          url: "#",
        },
      ],
    },
    {
      id: "3",
      title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
      author: "Dr. Emily Chen",
      coAuthors: ["Prof. David Thompson", "Dr. Maria Gonzalez"],
      institution: "University of Tampa",
      publicationDate: "February 15, 2025",
      journal: "Youth and Society",
      volume: "57",
      issue: "3",
      pages: "245-268",
      doi: "10.5678/ys.2025.57.3.245",
      abstract:
        "This paper presents a comparative analysis of juvenile delinquency prevention programs across different socioeconomic contexts. Drawing on data from 28 programs implemented in urban, suburban, and rural communities, we evaluate their effectiveness in reducing risk factors and promoting protective factors among at-risk youth. Our findings indicate that programs incorporating family engagement, prosocial skill development, and educational support show the most promising outcomes across all contexts. However, program effectiveness varies significantly based on implementation quality and cultural relevance. We propose a framework for adapting evidence-based programs to specific community needs while maintaining program fidelity.",
      keywords: [
        "juvenile delinquency",
        "prevention programs",
        "at-risk youth",
        "program evaluation",
        "evidence-based practices",
      ],
      type: "Paper",
      fullText: "...", // Full text would be here
      references: [
        "Adams, J. R., & Robinson, P. (2023). Family-Based Interventions for Juvenile Delinquency: A 10-Year Follow-Up Study. Journal of Family Psychology, 37(2), 178-193.",
        "Bennett, T., & Watson, L. (2024). School-Based Prevention Programs: What Works and Why. Educational Psychology Review, 36(1), 52-71.",
        "Choi, J. J., & Green, D. L. (2022). Mentoring and Juvenile Delinquency: A Meta-Analysis. Youth Violence and Juvenile Justice, 20(3), 304-325.",
        "Dominguez, A., & Harris, K. (2023). Cultural Adaptations of Prevention Programs in Diverse Communities. Journal of Cultural Diversity and Ethnic Minority Psychology, 28(4), 415-432.",
        "Evans, C. B. R., & Fraser, M. W. (2024). Risk and Protective Factors in Juvenile Delinquency: Implications for Intervention. Criminology & Public Policy, 23(1), 89-118.",
      ],
      downloads: [
        {
          label: "Full PDF",
          url: "#",
        },
        {
          label: "Data Set",
          url: "#",
        },
        {
          label: "Supplementary Materials",
          url: "#",
        },
      ],
    },
  ];

  return articles.find((article) => article.id === id);
};

// Citation formats
const generateCitation = (article: any, format: string) => {
  switch (format) {
    case "apa":
      return `${article.author.split(",")[0]}, ${article.author
        .split(",")[0]
        .charAt(0)}. ${article.coAuthors
        .map((ca: string) => `${ca.split(",")[0]}, ${ca.split(",")[0].charAt(0)}.`)
        .join(", ")} (${new Date(article.publicationDate).getFullYear()}). ${
        article.title
      }. ${article.journal}, ${article.volume}(${article.issue}), ${
        article.pages
      }. https://doi.org/${article.doi}`;
    case "mla":
      return `${article.author.split(",")[0]}, ${article.author.split(" ").pop()}${article.coAuthors
        .map((ca: string) => `, and ${ca.split(",")[0]}, ${ca.split(" ").pop()}`)
        .join("")}. "${article.title}." ${article.journal}, vol. ${
        article.volume
      }, no. ${article.issue}, ${new Date(
        article.publicationDate
      ).getFullYear()}, pp. ${article.pages}. DOI: ${article.doi}.`;
    case "chicago":
      return `${article.author.split(",")[0]}, ${article.author.split(" ").pop()}${article.coAuthors
        .map((ca: string) => `, and ${ca.split(",")[0]}, ${ca.split(" ").pop()}`)
        .join("")}. "${article.title}." ${article.journal} ${article.volume}, no. ${
        article.issue
      } (${new Date(article.publicationDate).getFullYear()}): ${
        article.pages
      }. https://doi.org/${article.doi}.`;
    case "harvard":
      return `${article.author.split(",")[0]}, ${article.author
        .split(" ")
        .pop()
        .charAt(0)}.${article.coAuthors
        .map(
          (ca: string) =>
            `, ${ca.split(",")[0]}, ${ca.split(" ").pop().charAt(0)}.`
        )
        .join("")} ${new Date(article.publicationDate).getFullYear()}. '${
        article.title
      }', ${article.journal}, ${article.volume}(${article.issue}), pp. ${
        article.pages
      }. doi: ${article.doi}.`;
    default:
      return `${article.author} (${new Date(
        article.publicationDate
      ).getFullYear()}). ${article.title}. ${article.journal}, ${
        article.volume
      }(${article.issue}), ${article.pages}.`;
  }
};

export default function ArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("abstract");
  const [citationFormat, setCitationFormat] = useState("apa");
  const [showPrintView, setShowPrintView] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);

  useEffect(() => {
    // In a real app, this would be an async function that fetches from Firebase
    const fetchedArticle = getArticleById(id);
    setArticle(fetchedArticle);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    // Add print-specific styles when component mounts
    const style = document.createElement("style");
    style.id = "print-styles";
    style.innerHTML = `
      @media print {
        @page { margin: 2cm; }
        body { font-size: 12pt; }
        h1 { font-size: 18pt; }
        h2, h3 { font-size: 14pt; }
        header, footer, nav, .print-hide { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Remove the style element when component unmounts
      const styleElement = document.getElementById("print-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  const handleCopyCitation = () => {
    if (!article) return;

    const citation = generateCitation(article, citationFormat);
    navigator.clipboard.writeText(citation);
    toast.success("Citation copied to clipboard");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="ut-container py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="h-40 bg-slate-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-60 bg-slate-200 rounded"></div>
              <div className="h-60 bg-slate-200 rounded col-span-2"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="ut-container py-12">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Article Not Found</CardTitle>
              <CardDescription>
                The article you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/search">
                <Button>Return to Search</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      {showReadingMode ? (
        <ReadingModeView
          article={article}
          onClose={() => setShowReadingMode(false)}
        />
      ) : showPrintView ? (
        <PrintFriendlyView
          article={article}
          onClose={() => setShowPrintView(false)}
        />
      ) : (
        <MainLayout>
          <div className="ut-container py-8">
            <div className="mb-6">
              <Link href="/search" className="text-utred hover:underline mb-4 inline-block">
                ← Back to Search Results
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{article.title}</h1>
              <div className="flex flex-wrap gap-2 text-gray-600 mb-4">
                <span className="font-semibold">{article.author}</span>
                {article.coAuthors && article.coAuthors.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{article.coAuthors.join(", ")}</span>
                  </>
                )}
                <span>•</span>
                <span>{article.institution}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-utred/10 text-utred border-utred">
                  {article.type}
                </Badge>
                {article.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <Tabs defaultValue="abstract" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="abstract">Abstract</TabsTrigger>
                          <TabsTrigger value="fulltext">Full Text</TabsTrigger>
                          <TabsTrigger value="references">References</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="flex items-center gap-2 print-hide">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowReadingMode(true)}
                        className="flex items-center gap-2"
                      >
                        <BookOpen size={16} />
                        <span className="hidden sm:inline">Reading Mode</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPrintView(true)}
                        className="flex items-center gap-2"
                      >
                        <Printer size={16} />
                        <span className="hidden sm:inline">Print</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="abstract" className="mt-0">
                      <div className="prose max-w-none">
                        <p>{article.abstract}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="fulltext" className="mt-0">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{
                          __html: article.fullText.replace(/\n\n## /g, '</p><h2>')
                                                 .replace(/\n\n/g, '</p><p>')
                                                 .replace(/^## /g, '<h2>')
                                                 .replace(/^/g, '<p>')
                                                 + '</p>'
                        }} />
                      </div>
                    </TabsContent>
                    <TabsContent value="references" className="mt-0">
                      <div className="space-y-2">
                        {article.references.map((reference: string, index: number) => (
                          <p key={index} className="text-sm pl-8 indent-neg-8">
                            {reference}
                          </p>
                        ))}
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Publication Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Journal</dt>
                        <dd className="font-medium">{article.journal}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Publication Date</dt>
                        <dd className="font-medium">{article.publicationDate}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Volume & Issue</dt>
                        <dd className="font-medium">
                          Volume {article.volume}, Issue {article.issue}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Pages</dt>
                        <dd className="font-medium">{article.pages}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">DOI</dt>
                        <dd className="font-medium">
                          <a
                            href={`https://doi.org/${article.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-utred hover:underline"
                          >
                            {article.doi}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Article Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CollectionsButton
                          articleId={article.id}
                          articleTitle={article.title}
                        />
                        <ShareButton
                          articleId={article.id}
                          articleTitle={article.title}
                          articleDoi={article.doi}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <ReferenceExportButton article={article} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cite This Article</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={citationFormat === "apa" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCitationFormat("apa")}
                          className={citationFormat === "apa" ? "bg-utred" : ""}
                        >
                          APA
                        </Button>
                        <Button
                          variant={citationFormat === "mla" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCitationFormat("mla")}
                          className={citationFormat === "mla" ? "bg-utred" : ""}
                        >
                          MLA
                        </Button>
                        <Button
                          variant={citationFormat === "chicago" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCitationFormat("chicago")}
                          className={citationFormat === "chicago" ? "bg-utred" : ""}
                        >
                          Chicago
                        </Button>
                        <Button
                          variant={citationFormat === "harvard" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCitationFormat("harvard")}
                          className={citationFormat === "harvard" ? "bg-utred" : ""}
                        >
                          Harvard
                        </Button>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <FileText size={16} />
                            View Citation
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Citation - {citationFormat.toUpperCase()}</DialogTitle>
                            <DialogDescription>
                              Copy this citation to use in your research.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-gray-50 p-3 rounded border text-sm mt-2">
                            {generateCitation(article, citationFormat)}
                          </div>
                          <Button onClick={handleCopyCitation} className="bg-utred flex items-center gap-2">
                            <Copy size={16} />
                            Copy to Clipboard
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {article.downloads && article.downloads.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Downloads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {article.downloads.map((download: any, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full text-left justify-start"
                            asChild
                          >
                            <a href={download.url} download>
                              <FileDown className="h-4 w-4 mr-2" />
                              {download.label}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* These would be dynamically generated based on keywords or topic similarity */}
                {[1, 2, 3].filter(relId => relId.toString() !== id).map((relId) => {
                  const relatedArticle = getArticleById(relId.toString());
                  if (!relatedArticle) return null;

                  return (
                    <Card key={relId} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Link href={`/article/${relId}`} className="hover:text-utred">
                            {relatedArticle.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          <span className="text-utred">{relatedArticle.type}</span> •{" "}
                          {relatedArticle.publicationDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                          {relatedArticle.abstract}
                        </p>
                        <p className="text-sm font-medium">{relatedArticle.author}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
}
