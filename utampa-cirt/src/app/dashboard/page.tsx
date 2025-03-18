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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AreaChart, BookOpen, FileUp, PlusCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  // This is a mocked authenticated page for demo purposes
  const isAuthenticated = true;

  return (
    <MainLayout isAuthenticated={isAuthenticated}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your CIRT database dashboard.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  My Publications
                </CardTitle>
                <BookOpen className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-sm text-gray-600">
                  Total publications in database
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/publications">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View All
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Publication Views
                </CardTitle>
                <AreaChart className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">153</div>
                <p className="text-sm text-gray-600">
                  Total views across all your publications
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/analytics">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View Analytics
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Database Status
                </CardTitle>
                <Search className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">324</div>
                <p className="text-sm text-gray-600">
                  Total publications in system
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/search">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    Search Database
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Article</CardTitle>
                <CardDescription>
                  Upload your latest research to share with the CIRT community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center gap-4">
                    <FileUp className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium mb-1">
                        Drag and drop your PDF here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        or click to browse files
                      </p>
                      <Input
                        type="file"
                        id="fileInput"
                        accept="application/pdf"
                        className="hidden"
                      />
                      <Button className="bg-utred hover:bg-utred-dark">
                        Select PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Maximum file size: 10MB
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-utred hover:bg-utred-dark">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload Article
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Article Details</DialogTitle>
                      <DialogDescription>
                        Add additional information about your publication
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="article-type">Article Type</Label>
                        <select
                          id="article-type"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utred focus:border-utred"
                        >
                          <option value="Article">Article</option>
                          <option value="Journal">Journal</option>
                          <option value="Poster">Poster</option>
                          <option value="Paper">Paper</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="keywords">
                          Keywords (comma-separated)
                        </Label>
                        <Input
                          id="keywords"
                          placeholder="e.g., criminology, research, policy"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="bg-utred hover:bg-utred-dark">
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Publications Table */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>My Recent Publications</CardTitle>
                <CardDescription>
                  View and manage your recent contributions to the CIRT database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPublications.map((pub) => (
                      <TableRow key={pub.id}>
                        <TableCell className="font-medium">
                          {pub.title}
                        </TableCell>
                        <TableCell>{pub.type}</TableCell>
                        <TableCell>{pub.date}</TableCell>
                        <TableCell>
                          <span className={getStatusClass(pub.status)}>
                            {pub.status}
                          </span>
                        </TableCell>
                        <TableCell>{pub.views}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/publications/${pub.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/publications">
                  <Button variant="outline">View All Publications</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Helper function for status styling
function getStatusClass(status: string) {
  switch (status) {
    case "Approved":
      return "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full";
    case "Under Review":
      return "px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full";
    case "Sent":
      return "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full";
    case "Declined":
      return "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full";
    default:
      return "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full";
  }
}

// Sample data
const myPublications = [
  {
    id: 1,
    title: "The Impact of Community Policing on Urban Crime Rates",
    type: "Article",
    date: "Mar 10, 2025",
    status: "Approved",
    views: 47,
  },
  {
    id: 2,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "Feb 15, 2025",
    status: "Under Review",
    views: 12,
  },
  {
    id: 3,
    title:
      "Technology in Law Enforcement: Current Trends and Future Applications",
    type: "Poster",
    date: "Jan 22, 2025",
    status: "Sent",
    views: 94,
  },
];
