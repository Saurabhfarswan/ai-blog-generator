'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

import logo from  '../../../public/aiblog (2).png'
import ch from  '../../../public/chromebg.png'
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
        <Image src={logo} alt="Logo" width={100} height={100} className="inline-block mr-2" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-6 font-medium text-gray-700  hover:underline">
          
          <Link href="/">Add to chrome
           <Image src={ch} alt="Logo" width={60} height={60} 
           
           className="inline-block mr-2" /></Link>
        
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="sm:hidden mt-2 space-y-2 text-gray-700 font-medium">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/generate" onClick={() => setIsOpen(false)}>Generate</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link> 
        </div>
      )}
    </header>
  );
};

export default Header;
