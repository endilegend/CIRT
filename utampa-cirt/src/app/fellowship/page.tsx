"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

// Sample fellowship data - replace with actual data
const fellows = [
  {
    id: 1,
    name: "Dr. Tim Cheese",
    title: "Director of CIRT",
    image: "/images/fellows/fellow.jpg",
    email: "bdulisse@ut.edu",
    specialties: [
      "Corrections",
      "Cybercrime",
      "Financial Crime",
      "Criminal Justice Policy",
    ],
  },
  {
    id: 2,
    name: "Dr. Danster Connealy",
    title: "Associate Director of Consultation and Training",
    image: "/images/fellows/dan.jpg",
    email: "nconnealy@ut.edu",
    specialties: [
      "Policing/Law Enforcement",
      "Criminal Justice Policy",
      "Quantitative Data",
    ],
  },
  {
    id: 3,
    name: "Dr. Chivon Fitch",
    title: "CIRT Liaison to the Industry Advisory Board",
    image: "/images/fellows/ant.jpg",
    email: "cfitch@ut.edu",
    specialties: [
      "Policing/Law Enforcement",
      "Criminal Justice Policy",
      "Victimization",
      "Corrections",
    ],
  },
  {
    id: 4,
    name: "Dr. Mayisha Hart",
    title: "Associate Director of Research and Engagement",
    image: "/images/fellows/maya.jpg",
    email: "thart@ut.edu",
    specialties: ["Victimization", "Crime Analysis/Mapping"],
  },
  {
    id: 5,
    name: "Dr. Lamine Yamal",
    title: "Research Associate",
    image: "/images/fellows/lamine.jpg",
    email: "aosuna@ut.edu",
    specialties: [
      "Victimization",
      "Vulnerability and Intersectionality",
      "Qualitative Research Methods",
    ],
  },
  {
    id: 6,
    name: "Dr. Leo Genco",
    title: "Research Associate",
    image: "/images/fellows/vlad.jpg",
    email: "lgenco@ut.edu",
    specialties: [
      "Violent Crime",
      "Wildlife and Environmental Crime",
      "Animal Cruelty",
      "Statistics and Data Analysis",
    ],
  },
];

export default function FellowshipPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-utblack to-utblack-light text-white py-16">
        <div className="ut-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              CIRT <span className="text-utred">Fellowship</span>
            </h1>
            <p className="text-xl">
              Meet our distinguished fellows and research associates at the
              Criminology Institute for Research and Training
            </p>
          </div>
        </div>
      </section>

      {/* Fellows Grid */}
      <section className="py-16 bg-white">
        <div className="ut-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fellows.map((fellow) => (
              <Card key={fellow.id} className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={fellow.image}
                    alt={fellow.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{fellow.name}</CardTitle>
                  <CardDescription className="text-utred font-medium">
                    {fellow.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <a
                        href={`mailto:${fellow.email}`}
                        className="hover:text-utred"
                      >
                        {fellow.email}
                      </a>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fellow.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
