import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder = 'Select...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200
          ${isOpen 
            ? 'bg-gray-800/80 border-blue-500/50 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' 
            : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70'
          }
        `}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <div className="flex items-center justify-center">
              {typeof selectedOption.icon === 'function' ? (
                <selectedOption.icon className={`w-5 h-5 ${selectedOption.color || 'text-gray-400'}`} />
              ) : (
                <span className="text-lg">{selectedOption.icon}</span>
              )}
            </div>
          )}
          <span className={`font-medium text-sm ${selectedOption ? 'text-gray-100' : 'text-gray-500'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-in">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-800/50">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search types..."
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin p-1">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                  ${value === option.value 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100'
                  }
                `}
              >
                {option.icon && (
                  <div className="flex items-center justify-center w-6 h-6">
                    {typeof option.icon === 'function' ? (
                      <option.icon className={`w-4 h-4 ${option.color || 'text-gray-400'}`} />
                    ) : (
                      <span className="text-base">{option.icon}</span>
                    )}
                  </div>
                )}
                <span className="flex-1 text-left font-medium">{option.label}</span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-blue-400" />
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
