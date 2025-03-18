"use client";

import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-utblack to-utblack-light text-white py-16">
                <div className="ut-container">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            About the <span className="text-utred">CIRT</span>
                        </h1>
                        <p className="text-xl">
                            The Criminology Institute for Research and Training at the University of Tampa
                        </p>
                    </div>
                </div>
            </section>

            {/* History & Overview */}
            <section className="py-16 bg-white">
                <div className="ut-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-utblack">Our History</h2>
                            <div className="space-y-4">
                                <p>
                                    Founded in 2015, the Criminology Institute for Research and Training (CIRT) was established to address the growing need for evidence-based approaches to criminology and criminal justice issues in Florida and beyond.
                                </p>
                                <p>
                                    What began as a small departmental initiative has grown into a comprehensive research center that brings together faculty, students, and professionals from across disciplines to tackle complex issues in criminology.
                                </p>
                                <p>
                                    Today, CIRT stands as a pillar of the University of Tampa's commitment to academic excellence and community engagement, with partnerships extending to law enforcement agencies, policy makers, and community organizations.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="/images/ut-plant-hall.jpg"
                                alt="University of Tampa Plant Hall"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 bg-slate-50">
                <div className="ut-container">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-utblack">Our Mission & Values</h2>
                        <p className="text-lg">
                            At CIRT, we're committed to advancing knowledge in criminology through rigorous research, innovative education, and meaningful community engagement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-t-4 border-t-utred">
                            <CardHeader>
                                <CardTitle>Research Excellence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    We're dedicated to conducting and supporting high-quality research that contributes meaningfully to the field of criminology and criminal justice. Our work spans theoretical advancements, empirical studies, and applied research with direct policy implications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-utred">
                            <CardHeader>
                                <CardTitle>Educational Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    We believe in transformative education that prepares students for careers in criminology and criminal justice. Through internships, research assistantships, workshops, and mentoring, we develop the next generation of criminology professionals.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-utred">
                            <CardHeader>
                                <CardTitle>Community Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Our work extends beyond the university to address real-world challenges. We partner with community organizations and agencies to develop evidence-based approaches to crime prevention, intervention, and policy development.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Research Areas */}
            <section className="py-16 bg-white">
                <div className="ut-container">
                    <h2 className="text-3xl font-bold mb-12 text-center text-utblack">Research Focus Areas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-utred">Criminal Behavior & Psychology</h3>
                            <p>Investigating the psychological, social, and environmental factors that influence criminal behavior, including studies on juvenile delinquency, recidivism, and rehabilitation.</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-utred">Criminal Justice Policy</h3>
                            <p>Analyzing the effectiveness of policies and practices within the criminal justice system, from policing strategies to sentencing guidelines and correctional approaches.</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-utred">Digital & Cybercrime</h3>
                            <p>Examining emerging forms of criminal activity in the digital space, including identity theft, online fraud, cyberbullying, and strategies for digital forensics and prevention.</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-utred">Community-Based Approaches</h3>
                            <p>Researching innovative community-based approaches to crime prevention and intervention, with an emphasis on restorative justice practices and community policing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-16 bg-slate-50">
                <div className="ut-container">
                    <h2 className="text-3xl font-bold mb-12 text-center text-utblack">Leadership Team</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {facultyMembers.map((member) => (
                            <Card key={member.id} className="overflow-hidden border-none shadow-lg">
                                <div className="relative h-60 w-full">
                                    <Image
                                        // src={member.image}
                                        // alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardHeader className="bg-white">
                                    <CardTitle>{member.name}</CardTitle>
                                    <CardDescription className="text-utred font-medium">{member.title}</CardDescription>
                                </CardHeader>
                                <CardContent className="bg-white pt-0">
                                    <p className="text-sm text-gray-600">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 bg-white">
                <div className="ut-container">
                    <h2 className="text-3xl font-bold mb-12 text-center text-utblack">Our Achievements</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-utred">Research & Publications</h3>
                            <ul className="space-y-3 list-disc pl-5">
                                <li>Published over 75 peer-reviewed articles in top criminology journals since 2015</li>
                                <li>Secured more than $2.5 million in external research grants</li>
                                <li>Developed the comprehensive CIRT Database with over 10,000 resources</li>
                                <li>Established annual "Advances in Criminology" conference, now in its 5th year</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4 text-utred">Community Impact</h3>
                            <ul className="space-y-3 list-disc pl-5">
                                <li>Implemented evidence-based intervention programs in 12 local schools</li>
                                <li>Partnered with Tampa Police Department on community policing initiatives</li>
                                <li>Provided data analysis support for local policy decisions on juvenile justice</li>
                                <li>Trained over 300 professionals in research methods and criminal justice innovations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-utred text-white py-16">
                <div className="ut-container text-center">
                    <h2 className="text-3xl font-bold mb-4">Connect With CIRT</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Interested in our research, academic programs, or potential collaborations? We'd love to hear from you.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link href="/contact">
                            <Button className="bg-white text-utred hover:bg-gray-100 py-2 px-6 rounded-md text-lg">
                                Contact Us
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white/10 py-2 px-6 rounded-md text-lg"
                            >
                                Explore Our Research
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

// Faculty data
const facultyMembers = [
    {
        id: 1,
        name: "Dr. Maria Reynolds",
        title: "Director, CIRT",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        bio: "Dr. Reynolds specializes in criminal justice policy and has over 20 years of experience in criminology research. She leads the institute's strategic initiatives and research programs.",
    },
    {
        id: 2,
        name: "Dr. James Wilson",
        title: "Research Director",
        image: "https://randomuser.me/api/portraits/men/42.jpg",
        bio: "With expertise in quantitative criminology and statistical analysis, Dr. Wilson oversees the research methodology and data analysis components of CIRT's projects.",
    },
    {
        id: 3,
        name: "Dr. Sarah Chen",
        title: "Education Coordinator",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        bio: "Dr. Chen's focus on criminological theory and pedagogy makes her instrumental in developing educational programs and student engagement initiatives at CIRT.",
    },
];