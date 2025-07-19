// src/pages/Home.tsx - Hero section with consistent navy blue color
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import { events, categories } from '@/data/events';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import EnhancedFooter from '@/components/EnhancedFooter';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      const matchesDate = searchDate === '' || event.date === searchDate;
      
      const matchesLocation = searchLocation === '' || 
        event.location.toLowerCase().includes(searchLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesDate && matchesLocation;
    });
  }, [searchTerm, selectedCategory, searchDate, searchLocation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      

      {/* Hero Section */}
      <section className="text-white" style={{ background: 'linear-gradient(to right, #0A1F44, #0d2757)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find and book tickets for the best events in your area
            </p>
          </div>
        </div>
      </section>


      {/* Search Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSearchDate('');
                setSearchLocation('');
                setSelectedCategory('All');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">{events.length}+</h3>
                <p className="text-gray-600 dark:text-gray-300">Events Available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">5K+</h3>
                <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">10+</h3>
                <p className="text-gray-600 dark:text-gray-300">Cities Covered</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {filteredEvents.length} events found
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
      <EnhancedFooter />
    </div>
  );
};

export default Home;