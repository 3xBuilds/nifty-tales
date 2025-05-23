import { useGlobalContext } from "./context/MainContext";

export function toggleDarkMode() {
  const htmlElement = document.documentElement; // Get the <html> element
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark'); // Disable dark mode
    localStorage.setItem('theme', 'light'); // Save preference
  } else {
    htmlElement.classList.add('dark'); // Enable dark mode
    localStorage.setItem('theme', 'dark'); // Save preference
  }
}

// Initialize theme based on saved preference
export function initializeTheme() {

    const {night, setNight} = useGlobalContext()

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    setNight(true);
  } else {
    document.documentElement.classList.remove('dark');
    setNight(false);
  }
}
