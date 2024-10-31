// components/Footer.tsx
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              © 2024 EduManagePro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                <Icons.twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                <Icons.facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                <Icons.linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}