// import {
//     // Icons
//     Activity,
//     AlertCircle,
//     AlertTriangle,
//     Archive,
//     ArrowDown,
//     ArrowLeft,
//     ArrowRight,
//     ArrowUp,
//     BarChart,
//     Bell,
//     Book,
//     Bookmark,
//     Calendar,
//     Camera,
//     Check,
//     CheckCircle,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     ChevronUp,
//     Clock,
//     Cloud,
//     Code,
//     Coffee,
//     Command,
//     Copy,
//     CreditCard,
//     Database,
//     Download,
//     Edit,
//     Eye,
//     EyeOff,
//     File,
//     FileText,
//     Filter,
//     Folder,
//     Github,
//     Globe,
//     Grid,
//     HardDrive,
//     Hash,
//     Heart,
//     Home,
//     Image,
//     Inbox,
//     Info,
//     Key,
//     Layers,
//     Layout,
//     Link,
//     List,
//     Lock,
//     LogIn,
//     LogOut,
//     Mail,
//     Map,
//     Menu,
//     MessageCircle,
//     MessageSquare,
//     Mic,
//     Moon,
//     MoreHorizontal,
//     MoreVertical,
//     Move,
//     Music,
//     Paperclip,
//     Pause,
//     Phone,
//     Play,
//     Plus,
//     PlusCircle,
//     Power,
//     Printer,
//     Radio,
//     RefreshCw,
//     Save,
//     Search,
//     Send,
//     Settings,
//     Share,
//     Shield,
//     ShoppingBag,
//     ShoppingCart,
//     Shuffle,
//     Slack,
//     Slash,
//     Sliders,
//     Smartphone,
//     Smile,
//     Speaker,
//     Square,
//     Star,
//     Sun,
//     Table,
//     Tablet,
//     Tag,
//     Target,
//     Terminal,
//     Thermometer,
//     ThumbsDown,
//     ThumbsUp,
//     Trash,
//     Trash2,
//     Trophy,
//     Twitter,
//     Upload,
//     User,
//     UserPlus,
//     Users,
//     Video,
//     Voicemail,
//     Volume,
//     Volume1,
//     Volume2,
//     VolumeX,
//     Watch,
//     Wifi,
//     X,
//     XCircle,
//     ZapOff,
//     Zap,
//     // YouTube,

//     // Core attributes and properties
//     // createIcon,
//     // icons,

//     // Icon variants
//     IconNode,
//     LucideIcon,
//     LucideProps
// } from "lucide-react";

// // lucide-react scope
// export const lucideScope = {
//     // Icons
//     Activity,
//     AlertCircle,
//     AlertTriangle,
//     Archive,
//     ArrowDown,
//     ArrowLeft,
//     ArrowRight,
//     ArrowUp,
//     BarChart,
//     Bell,
//     Book,
//     Bookmark,
//     Calendar,
//     Camera,
//     Check,
//     CheckCircle,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     ChevronUp,
//     Clock,
//     Cloud,
//     Code,
//     Coffee,
//     Command,
//     Copy,
//     CreditCard,
//     Database,
//     Download,
//     Edit,
//     Eye,
//     EyeOff,
//     File,
//     FileText,
//     Filter,
//     Folder,
//     Github,
//     Globe,
//     Grid,
//     HardDrive,
//     Hash,
//     Heart,
//     Home,
//     Image,
//     Inbox,
//     Info,
//     Key,
//     Layers,
//     Layout,
//     Link,
//     List,
//     Lock,
//     LogIn,
//     LogOut,
//     Mail,
//     Map,
//     Menu,
//     MessageCircle,
//     MessageSquare,
//     Mic,
//     Moon,
//     MoreHorizontal,
//     MoreVertical,
//     Move,
//     Music,
//     Paperclip,
//     Pause,
//     Phone,
//     Play,
//     Plus,
//     PlusCircle,
//     Power,
//     Printer,
//     Radio,
//     RefreshCw,
//     Save,
//     Search,
//     Send,
//     Settings,
//     Share,
//     Shield,
//     ShoppingBag,
//     ShoppingCart,
//     Shuffle,
//     Slack,
//     Slash,
//     Sliders,
//     Smartphone,
//     Smile,
//     Speaker,
//     Square,
//     Star,
//     Sun,
//     Table,
//     Tablet,
//     Tag,
//     Target,
//     Terminal,
//     Thermometer,
//     ThumbsDown,
//     ThumbsUp,
//     Trash,
//     Trash2,
//     Trophy,
//     Twitter,
//     Upload,
//     User,
//     UserPlus,
//     Users,
//     Video,
//     Voicemail,
//     Volume,
//     Volume1,
//     Volume2,
//     VolumeX,
//     Watch,
//     Wifi,
//     X,
//     XCircle,
//     ZapOff,
//     Zap,
//     // YouTube,

//     // Core attributes and properties
//     // createIcon,
//     // icons,

//     // Icon variants
//     // IconNode,
//     // LucideIcon,
//     // LucideProps
// };

import * as LucideIcons from "lucide-react";

// Create scope with only the actual components using type assertion
const componentNames = Object.keys(LucideIcons).filter(key =>
    typeof (LucideIcons as any)[key] === 'function' || typeof (LucideIcons as any)[key] === 'object'
);

// Create scope with type assertion
export const lucideScope = componentNames.reduce((acc, name) => {
    acc[name] = (LucideIcons as any)[name];
    return acc;
}, {} as Record<string, any>);