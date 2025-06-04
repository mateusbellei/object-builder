/*
*  Copyright (c) 2014-2025 Object Builder <https://github.com/ottools/ObjectBuilder>
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the "Software"), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

package nail.utils
{
    import flash.desktop.NativeApplication;

    /**
     * Utility class to access application descriptor information
     * dynamically from ObjectBuilder-app.xml
     */
    public final class Descriptor
    {
        //--------------------------------------------------------------------------
        // PRIVATE PROPERTIES
        //--------------------------------------------------------------------------
        
        private static var _applicationXML:XML;
        
        //--------------------------------------------------------------------------
        // PUBLIC METHODS
        //--------------------------------------------------------------------------
        
        /**
         * Gets the application descriptor XML
         */
        private static function get applicationXML():XML
        {
            if (!_applicationXML) {
                _applicationXML = NativeApplication.nativeApplication.applicationDescriptor;
            }
            return _applicationXML;
        }
        
        /**
         * Gets the application name from the descriptor
         */
        public static function getName():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            return xml.ns::name.toString();
        }
        
        /**
         * Gets the version number from the descriptor (versionNumber field)
         * This is used for internal compatibility and validation
         */
        public static function getVersionNumber():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            return xml.ns::versionNumber.toString();
        }
        
        /**
         * Gets the version label from the descriptor (versionLabel field)
         * This is typically what users see in the interface
         */
        public static function getVersionLabel():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            var versionLabel:String = xml.ns::versionLabel.toString();
            
            // Fallback to versionNumber if versionLabel is not specified
            if (!versionLabel || versionLabel.length == 0) {
                return getVersionNumber();
            }
            
            return versionLabel;
        }
        
        /**
         * Gets the copyright information from the descriptor
         */
        public static function getCopyright():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            return xml.ns::copyright.toString();
        }
        
        /**
         * Gets the application ID from the descriptor
         */
        public static function getApplicationId():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            return xml.ns::id.toString();
        }
        
        /**
         * Gets the filename from the descriptor
         */
        public static function getFilename():String
        {
            var xml:XML = applicationXML;
            var ns:Namespace = xml.namespace();
            return xml.ns::filename.toString();
        }
        
        //--------------------------------------------------------------------------
        // CONSTRUCTOR
        //--------------------------------------------------------------------------
        
        /**
         * Private constructor - this is a static utility class
         */
        public function Descriptor()
        {
            throw new Error("Descriptor is a static utility class and cannot be instantiated.");
        }
    }
} 