import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CustomDropdown = ({ options, value, onChange, placeholder = 'Select...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Theme-aware classes
  const triggerClasses = isOpen
    ? (isLight
        ? 'bg-white border-blue-400 ring-2 ring-blue-200 shadow-lg shadow-blue-500/10'
        : 'bg-gray-800/80 border-blue-500/50 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10')
    : (isLight
        ? 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70');

  const menuClasses = isLight
    ? 'bg-white border-gray-200 shadow-2xl shadow-gray-200/50'
    : 'bg-gray-900 border-gray-700/50 shadow-2xl shadow-black/50';

  const searchBorder = isLight ? 'border-gray-200' : 'border-gray-800/50';
  const searchInputClasses = isLight
    ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500/50'
    : 'bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/60';

  const optionBase = isLight ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100';
  const optionSelected = isLight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  const emptyText = isLight ? 'text-gray-400' : 'text-gray-500';
  const checkColor = isLight ? 'text-blue-600' : 'text-blue-400';
  const selectedText = isLight ? 'text-gray-900' : 'text-gray-100';
  const placeholderText = isLight ? 'text-gray-400' : 'text-gray-500';
  const chevronColor = isLight ? 'text-gray-400' : 'text-gray-500';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${triggerClasses}`}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <div className="flex items-center justify-center">
              {typeof selectedOption.icon === 'function' ? (
                <selectedOption.icon className={`w-5 h-5 ${selectedOption.color || (isLight ? 'text-gray-500' : 'text-gray-400')}`} />
              ) : (
                <span className="text-lg">{selectedOption.icon}</span>
              )}
            </div>
          )}
          <span className={`font-medium text-sm ${selectedOption ? selectedText : placeholderText}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 ${chevronColor} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden animate-slide-in ${menuClasses}`}>
          {/* Search Input */}
          <div className={`p-3 border-b ${searchBorder}`}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search types..."
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${searchInputClasses}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin p-1">
            {filteredOptions.length === 0 && (
              <div className={`px-4 py-3 text-sm text-center ${emptyText}`}>
                No options found
              </div>
            )}
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  value === option.value ? optionSelected : optionBase
                }`}
              >
                {option.icon && (
                  <div className="flex items-center justify-center w-6 h-6">
                    {typeof option.icon === 'function' ? (
                      <option.icon className={`w-4 h-4 ${option.color || (isLight ? 'text-gray-500' : 'text-gray-400')}`} />
                    ) : (
                      <span className="text-base">{option.icon}</span>
                    )}
                  </div>
                )}
                <span className="flex-1 text-left font-medium">{option.label}</span>
                {value === option.value && (
                  <Check className={`w-4 h-4 ${checkColor}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
