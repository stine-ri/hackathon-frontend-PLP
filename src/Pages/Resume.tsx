import React, { useState, useRef } from "react";
import ResumeForm from "../Components/ResumeForm";
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Sparkles, 
  CheckCircle,
  Mail,
  User,
  Code,
  Briefcase,
  MapPin,
  Phone,
  Award,
  GraduationCap,
  Palette,
  Zap,
  Star
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  skills: string;
  projects: string;
  experience?: string;
  education?: string;
  summary?: string;
}

// Import template preview images
import modernTemplateImg from '../assets/images/modernTemplateImg.jpg';
import classicTemplateImg from '../assets/images/classicTemplateImg.jpg';
import creativeTemplateImg from '../assets/images/creativeTemplateImg.jpg';

const Resume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  type TemplateId = 'modern' | 'classic' | 'creative';
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('modern');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

const handleDownloadPDF = async () => {
  if (!resumeRef.current || !resumeData) return;
  
  setIsGeneratingPDF(true);
  try {
    const originalElement = resumeRef.current;
    
    // Fix 1: Validate element reference and visibility
    console.log('Element validation:', {
      width: originalElement.scrollWidth,
      height: originalElement.scrollHeight,
      offsetWidth: originalElement.offsetWidth,
      offsetHeight: originalElement.offsetHeight,
      visible: originalElement.offsetParent !== null
    });
    
    if (originalElement.offsetParent === null) {
      console.error('Element is hidden');
      throw new Error('Element is not visible');
    }
    
    if (originalElement.scrollWidth === 0 || originalElement.scrollHeight === 0) {
      console.error('Element has zero dimensions');
      throw new Error('Element has zero dimensions');
    }
    
    // Fix 2: Wait for fonts and content to load properly
    await document.fonts.ready;
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(undefined);
      } else {
        window.addEventListener('load', () => resolve(undefined), { once: true });
      }
    });
    
    // Create temporary style with improved CSS overrides
    const tempStyleId = 'oklch-override-style';
    const existingTempStyle = document.getElementById(tempStyleId);
    if (existingTempStyle) {
      existingTempStyle.remove();
    }
    
    const tempStyle = document.createElement('style');
    tempStyle.id = tempStyleId;
    tempStyle.textContent = `
      /* Fix 3: Ensure element visibility and basic display properties */
      .resume-pdf-generation {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        position: relative !important;
      }
      
      /* Fix 4: More targeted OKLCH color replacements */
      .resume-pdf-generation [style*="oklch"] {
        color: #8B5CF6 !important;
      }
      
      /* Target specific Tailwind classes that might use OKLCH */
      .resume-pdf-generation .text-purple-600,
      .resume-pdf-generation .text-purple-500 {
        color: #8B5CF6 !important;
      }
      
      .resume-pdf-generation .bg-purple-600,
      .resume-pdf-generation .bg-purple-500 {
        background-color: #8B5CF6 !important;
      }
      
      .resume-pdf-generation .border-purple-600,
      .resume-pdf-generation .border-purple-500 {
        border-color: #8B5CF6 !important;
      }
      
      .resume-pdf-generation .text-pink-600,
      .resume-pdf-generation .text-pink-500 {
        color: #EC4899 !important;
      }
      
      .resume-pdf-generation .bg-pink-600,
      .resume-pdf-generation .bg-pink-500 {
        background-color: #EC4899 !important;
      }
      
      .resume-pdf-generation .border-pink-600,
      .resume-pdf-generation .border-pink-500 {
        border-color: #EC4899 !important;
      }
      
      .resume-pdf-generation .bg-gradient-to-r {
        background: linear-gradient(to right, #8B5CF6, #3B82F6) !important;
      }
      
      /* Ensure text is visible */
      .resume-pdf-generation * {
        color: inherit;
        background-color: inherit;
        border-color: inherit;
      }
    `;
    
    document.head.appendChild(tempStyle);
    
    // Add the temporary class to the original element
    originalElement.classList.add('resume-pdf-generation');
    
    // Fix 5: Increased wait time for styles to apply
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fix 6: Improved html2canvas configuration
    const canvas = await html2canvas(originalElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true, // Enable logging to debug issues
      // Let html2canvas determine dimensions automatically
      removeContainer: false,
      foreignObjectRendering: false, // Disable to avoid potential issues
      imageTimeout: 15000, // Increase timeout for slow-loading images
      onclone: (clonedDoc, clonedElement) => {
        // Ensure the cloned element has the same class
        clonedElement.classList.add('resume-pdf-generation');
        
        // Add the style to the cloned document as well
        const clonedStyle = clonedDoc.createElement('style');
        clonedStyle.textContent = tempStyle.textContent;
        clonedDoc.head.appendChild(clonedStyle);
        
        // Fix 7: More comprehensive OKLCH color replacement
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          const element = el as HTMLElement;
          const style = element.getAttribute('style');
          if (style && style.includes('oklch')) {
            const newStyle = style.replace(/oklch\([^)]*\)/g, '#8B5CF6');
            element.setAttribute('style', newStyle);
          }
          
          // Also check computed styles if available
          if (element.style) {
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const value = element.style.getPropertyValue(prop);
              if (value && value.includes('oklch')) {
                element.style.setProperty(prop, '#8B5CF6');
              }
            });
          }
        });
      }
    });
    
    // Clean up - remove the temporary class and style
    originalElement.classList.remove('resume-pdf-generation');
    document.head.removeChild(tempStyle);
    
    // Fix 8: Validate canvas before creating PDF
    console.log('Canvas validation:', {
      width: canvas.width,
      height: canvas.height,
      hasContent: canvas.width > 0 && canvas.height > 0
    });
    
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas has zero dimensions after rendering');
    }
    
    const imgData = canvas.toDataURL('image/png');
    
    // Fix 9: Validate image data
    console.log('Image data length:', imgData.length);
    if (imgData.length < 1000) {
      throw new Error('Canvas appears to be empty');
    }
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const yPosition = 10;
    
    // Fix 10: Improved PDF sizing logic
    if (imgHeight > pageHeight - 20) {
      const scaledHeight = pageHeight - 20;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, yPosition, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    }
    
    // Generate filename safely
    const filename = `${resumeData.name.replace(/[^a-zA-Z0-9]/g, '_')}_resume.pdf`;
    pdf.save(filename);
    
    console.log('PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    alert(`Failed to generate PDF: ${errorMessage}. Please try again.`);
  } finally {
    setIsGeneratingPDF(false);
  }
};


  const handleShare = () => {
    if (!resumeData) return;
    
    const dataStr = JSON.stringify(resumeData);
    const encodedData = encodeURIComponent(dataStr);
    const link = `${window.location.origin}${window.location.pathname}?data=${encodedData}&template=${activeTemplate}`;
    
    setShareLink(link);
    
    if (navigator.share) {
      navigator.share({
        title: `${resumeData.name}'s Resume`,
        text: 'Check out my resume created with Resume Builder',
        url: link,
      }).catch(() => {
        copyToClipboard(link);
      });
    } else {
      copyToClipboard(link);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link:', text);
    });
  };

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Clean and contemporary design with gradient accents',
      image: modernTemplateImg,
      color: 'from-purple-500 to-blue-500'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      description: 'Professional and timeless layout',
      image: classicTemplateImg,
      color: 'from-gray-600 to-gray-800'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Bold and unique with colorful elements',
      image: creativeTemplateImg,
      color: 'from-pink-500 to-purple-500'
    }
  ];

  // Modern Template Component
  const ModernResumeTemplate = ({ data }: { data: ResumeData }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 font-sans max-w-4xl mx-auto">
      <div className="bg-purple-600 text-white p-6 rounded-lg mb-6 -mx-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">{data.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-100">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {data.email}
            </div>
            {data.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {data.phone}
              </div>
            )}
            {data.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {data.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {data.summary && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.split(',').map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium shadow-md"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Projects
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.projects}
          </div>
        </div>
      </div>

      {data.experience && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Work Experience
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.experience}
            </div>
          </div>
        </div>
      )}

      {data.education && (
        <div>
          <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.education}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Classic Template Component
  const ClassicResumeTemplate = ({ data }: { data: ResumeData }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 font-serif max-w-4xl mx-auto">
      <div className="text-center border-b-4 border-gray-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-wide">{data.name}</h1>
        <div className="text-gray-600 text-sm space-y-1">
          <div className="flex items-center justify-center">
            <Mail className="w-4 h-4 mr-1" />
            {data.email}
          </div>
          {data.phone && (
            <div className="flex items-center justify-center">
              <Phone className="w-4 h-4 mr-1" />
              {data.phone}
            </div>
          )}
          {data.location && (
            <div className="flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-1" />
              {data.location}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {data.summary && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 tracking-wider">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify font-sans">{data.summary}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 tracking-wider">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-sans">
            {data.skills.split(',').map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-gray-800 rounded-full mr-2"></div>
                <span className="text-gray-700">{skill.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 tracking-wider">
            PROJECTS
          </h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line font-sans pl-4">
            {data.projects}
          </div>
        </div>

        {data.experience && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 tracking-wider">
              WORK EXPERIENCE
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line font-sans pl-4">
              {data.experience}
            </div>
          </div>
        )}

        {data.education && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 tracking-wider">
              EDUCATION
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line font-sans pl-4">
              {data.education}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Creative Template Component
  const CreativeResumeTemplate = ({ data }: { data: ResumeData }) => (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-pink-200 font-sans max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-pink-100">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {data.email}
            </div>
            {data.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {data.phone}
              </div>
            )}
            {data.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {data.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {data.summary && (
          <div className="bg-pink-50 p-5 rounded-xl border-l-8 border-pink-500">
            <h2 className="text-xl font-bold text-pink-600 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
          </div>
        )}

        <div className="bg-purple-50 p-5 rounded-xl border-l-8 border-purple-500">
          <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border-l-8 border-blue-500">
          <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Projects
          </h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.projects}
          </div>
        </div>

        {data.experience && (
          <div className="bg-green-50 p-5 rounded-xl border-l-8 border-green-500">
            <h2 className="text-xl font-bold text-green-600 mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Experience
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.experience}
            </div>
          </div>
        )}

        {data.education && (
          <div className="bg-yellow-50 p-5 rounded-xl border-l-8 border-yellow-500">
            <h2 className="text-xl font-bold text-yellow-600 mb-3 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.education}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full animate-float-delayed"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
                <p className="text-purple-200 text-lg">Create professional resumes in minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
              <span className="text-pink-300 font-medium">AI-Powered</span>
              <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!resumeData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 text-purple-600 mr-3" />
              Choose Your Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setActiveTemplate(template.id as TemplateId)}
                  className={`group relative p-0 rounded-2xl border-2 transition-all duration-500 text-left overflow-hidden transform hover:scale-105 ${
                    activeTemplate === template.id
                      ? 'border-purple-500 shadow-2xl scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                        <p className="text-purple-700 font-medium">{template.name}</p>
                      </div>
                    </div>
                    
                    <div className={`absolute inset-0 bg-gradient-to-t ${template.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    {activeTemplate === template.id && (
                      <div className="absolute top-3 right-3 bg-purple-600 text-white rounded-full p-2 shadow-lg animate-bounce">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-white flex items-center mb-2">
                    <User className="w-5 h-5 mr-2" />
                    Resume Information
                  </h2>
                  <p className="text-purple-100 text-sm">Fill in your details below to create your professional resume</p>
                </div>
              </div>
              <div className="p-6">
                <ResumeForm 
                  onGenerate={setResumeData} 
                  isPreviewMode={isPreviewMode}
                  initialData={resumeData}
                />
              </div>
            </div>

            {resumeData && (
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Resume Generated Successfully!
                </h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Resume
                  </button>
                </div>
                
                {shareLink && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 mb-3 font-medium">Shareable link created:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={shareLink} 
                        readOnly 
                        className="flex-1 p-3 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => copyToClipboard(shareLink)}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-white flex items-center mb-2">
                    <FileText className="w-5 h-5 mr-2" />
                    Resume Preview
                  </h2>
                  <p className="text-purple-100 text-sm">Live preview of your resume with {templates.find(t => t.id === activeTemplate)?.name} template</p>
                </div>
              </div>

              <div className="p-6">
                {!resumeData ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                      <FileText className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Resume Preview</h3>
                    <p className="text-gray-500 text-sm max-w-md">
                      Fill out the form on the left to see your professional resume preview here. 
                      Your resume will appear instantly as you type!
                    </p>
                  </div>
                ) : (
                  <div ref={resumeRef}>
                    {activeTemplate === 'modern' && <ModernResumeTemplate data={resumeData} />}
                    {activeTemplate === 'classic' && <ClassicResumeTemplate data={resumeData} />}
                    {activeTemplate === 'creative' && <CreativeResumeTemplate data={resumeData} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;