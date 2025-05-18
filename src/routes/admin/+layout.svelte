<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, createEventDispatcher } from 'svelte';
  
  interface NavItem {
    name: string;
    href: string;
    icon: string;
  }
  
  interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
  }

  interface User {
    name: string;
    email: string;
    avatar: string;
    role: string;
  }
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'grid' },
    { name: 'Products', href: '/admin/products', icon: 'package' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping-cart' },
    { name: 'Customers', href: '/admin/customers', icon: 'users' },
    { name: 'Analytics', href: '/admin/analytics', icon: 'bar-chart' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' }
  ];
  
  
  let currentUser: User = {
    name: 'Admin User',
    email: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
    role: 'Administrator'
  };


  let notifications: Notification[] = [
    {
      id: '1',
      title: 'New Order',
      message: 'You have received a new order #1234',
      time: '5 min ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Product "Wireless Headphones" is running low on stock',
      time: '2 hours ago',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Payment Success',
      message: 'Payment for order #1230 successfully processed',
      time: '1 day ago',
      read: true,
      type: 'success'
    }
  ];
  
  let isMobileMenuOpen = false;
  let isProfileDropdownOpen = false;
  let isNotificationsOpen = false;
  let isDarkMode = false;
  let unreadNotificationsCount = 0;
  let searchQuery = '';
  let isSearchActive = false;
  
 
  $: currentPath = $page.url.pathname;
  $: breadcrumbItems = generateBreadcrumbs(currentPath);
  
  const dispatch = createEventDispatcher();
  
  onMount(() => {
   
    checkAuth();
    
    if (typeof window !== 'undefined') {
      isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme();
      
      
      updateUnreadCount();
    }
  });
  
  function checkAuth() {
   
  }
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  function toggleProfileDropdown() {
    isProfileDropdownOpen = !isProfileDropdownOpen;
    if (isProfileDropdownOpen) {
      isNotificationsOpen = false;
    }
  }
  
  function toggleNotifications() {
    isNotificationsOpen = !isNotificationsOpen;
    if (isNotificationsOpen) {
      isProfileDropdownOpen = false;
    }
  }
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
    applyTheme();
    
  
    dispatch('themeChanged', { isDarkMode });
  }
  
  function applyTheme() {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
  
  function markNotificationAsRead(id: string) {
    notifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    updateUnreadCount();
  }
  
  function markAllNotificationsAsRead() {
    notifications = notifications.map(notification => ({ ...notification, read: true }));
    updateUnreadCount();
  }
  
  function updateUnreadCount() {
    unreadNotificationsCount = notifications.filter(n => !n.read).length;
  }
  
  function generateBreadcrumbs(path: string): {name: string, href: string}[] {
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    if (parts.length > 0) {
     
      breadcrumbs.push({ name: 'Home', href: '/admin' });
      
    
      let currentPath = '';
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        currentPath += `/${part}`;
        
   
        const navItem = navigation.find(item => item.href === `/admin${currentPath}`);
        const name = navItem ? navItem.name : part.charAt(0).toUpperCase() + part.slice(1);
        
        breadcrumbs.push({ name, href: `/admin${currentPath}` });
      }
    }
    
    return breadcrumbs;
  }
  
  function toggleSearch() {
    isSearchActive = !isSearchActive;
    if (isSearchActive) {
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    } else {
      searchQuery = '';
    }
  }
  
  function handleSearch(e: KeyboardEvent) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      
      // Example: navigate to search results
      // window.location.href = `/admin/search?q=${encodeURIComponent(searchQuery)}`;
      
      // For now, just emit an event that can be handled elsewhere
      dispatch('search', { query: searchQuery });
    }
  }
  
  function logout() {
   
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/api/user/login';
  }
  
  function getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'alert-triangle';
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      default: return 'bell';
    }
  }
  
  function getNotificationClass(type: string): string {
    switch (type) {
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }
</script>

<div class={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
  
  <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
    <div class={`flex flex-grow flex-col overflow-y-auto border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} pt-5`}>
      <div class="flex flex-shrink-0 items-center px-4">
        <span class={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>Group-6 Admin</span>
      </div>
      <div class="mt-5 flex flex-grow flex-col">
        <nav class="flex-1 space-y-1 px-2 pb-4">
          {#each navigation as item}
            <a
              href={item.href}
              class={`group flex items-center px-2 py-2 text-sm font-medium rounded-md 
                ${$page.url.pathname === item.href ? 
                  (isDarkMode ? 'bg-gray-900 text-white' : 'bg-indigo-100 text-indigo-600') : 
                  (isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}`}
            >
              <svg 
                class={`mr-3 h-6 w-6 ${$page.url.pathname === item.href ? 
                  (isDarkMode ? 'text-white' : 'text-indigo-500') : 
                  (isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500')}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(item.icon)} />
              </svg>
              {item.name}
            </a>
          {/each}
        </nav>
      </div>
      <div class={`flex-shrink-0 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <button
          on:click={toggleDarkMode}
          class={`group mb-4 flex w-full items-center rounded-md py-2 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <svg 
            class={`mr-3 h-6 w-6 ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isDarkMode ? 
              "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : 
              "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
          </svg>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          on:click={logout}
          class={`group flex w-full items-center rounded-md py-2 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <svg 
            class={`mr-3 h-6 w-6 ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </div>
  

  <div class="md:pl-64 flex flex-col flex-1">
   
    <div class={`sticky top-0 z-10 flex h-16 flex-shrink-0 ${isDarkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow'}`}>
     
      <button
        type="button"
        on:click={toggleMobileMenu}
        class={`border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden`}
      >
        <span class="sr-only">Open sidebar</span>
        <svg class={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
   
      <div class="flex flex-1 justify-between px-4">
      
        <div class="flex flex-1 items-center">
          <span class={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'} md:hidden`}>E-Shop Admin</span>
          
         
          <div class="ml-6 flex-1 max-w-lg hidden md:block">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg 
                  class={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search-input"
                type="text"
                bind:value={searchQuery}
                on:keydown={handleSearch}
                placeholder="Search..."
                class={`block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white placeholder:text-gray-400' : 'border-gray-300 text-gray-900 placeholder:text-gray-400'} pl-10 pr-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
              />
            </div>
          </div>
        </div>
        
        
        <div class="flex items-center">
          <!-- Mobile search toggle -->
          <button
            type="button"
            on:click={toggleSearch}
            class={`p-2 rounded-md md:hidden ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <span class="sr-only">Search</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
         
          {#if isSearchActive}
            <div class="fixed inset-0 z-20 md:hidden">
              <div class="absolute inset-0 bg-black bg-opacity-50" on:click={toggleSearch}></div>
              <div class={`absolute top-0 inset-x-0 p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div class="flex items-center">
                  <input
                    id="search-input"
                    type="text"
                    bind:value={searchQuery}
                    on:keydown={handleSearch}
                    placeholder="Search..."
                    class={`block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white placeholder:text-gray-400' : 'border-gray-300 text-gray-900 placeholder:text-gray-400'} px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
                  />
                  <button
                    type="button"
                    on:click={toggleSearch}
                    class={`ml-2 p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          {/if}
          
          
          <button
            type="button"
            on:click={toggleDarkMode}
            class={`p-2 rounded-md ml-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <span class="sr-only">Toggle dark mode</span>
            <svg 
              class="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d={isDarkMode ? 
                  "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : 
                  "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} 
              />
            </svg>
          </button>
          
          <!-- Notifications dropdown -->
          <div class="relative ml-2">
            <button
              type="button"
              on:click={toggleNotifications}
              class={`p-2 rounded-md relative ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {#if unreadNotificationsCount > 0}
                <span class="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadNotificationsCount < 10 ? unreadNotificationsCount : '9+'}
                </span>
              {/if}
            </button>
            
            {#if isNotificationsOpen}
              <div class={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}>
                <div class="px-4 py-2 border-b flex justify-between items-center">
                  <h3 class={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                  {#if unreadNotificationsCount > 0}
                    <button
                      on:click={markAllNotificationsAsRead}
                      class="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Mark all as read
                    </button>
                  {/if}
                </div>
                <div class="max-h-80 overflow-y-auto">
                  {#if notifications.length === 0}
                    <div class="py-4 text-center text-gray-500">No notifications</div>
                  {:else}
                    {#each notifications as notification}
                      <button
                        on:click={() => markNotificationAsRead(notification.id)}
                        class={`block w-full text-left px-4 py-3 hover:bg-gray-50 ${notification.read ? '' : isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      >
                        <div class="flex">
                          <div class={`flex-shrink-0 ${getNotificationClass(notification.type)}`}>
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(getNotificationIcon(notification.type))} />
                            </svg>
                          </div>
                          <div class="ml-3 w-0 flex-1">
                            <p class={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                            <p class={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{notification.message}</p>
                            <p class={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    {/each}
                  {/if}
                </div>
                <div class="px-4 py-2 border-t">
                  <a href="/admin/notifications" class="text-sm text-indigo-600 hover:text-indigo-500">View all notifications</a>
                </div>
              </div>
            {/if}
          </div>
          
        
          <div class="relative ml-3">
            <button
              type="button"
              on:click={toggleProfileDropdown}
              class="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" src={currentUser.avatar} alt="User avatar" />
            </button>
            
            {#if isProfileDropdownOpen}
              <div 
                class={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}
              >
                <div class={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p class={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Logged in as</p>
                  <p class={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser.email}</p>
                </div>
                <a 
                  href="/admin/profile" 
                  class={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Your Profile
                </a>
                <a 
                  href="/admin/settings" 
                  class={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Settings
                </a>
                <button
                  on:click={logout}
                  class={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Sign out
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
  
    {#if isMobileMenuOpen}
      <div class="fixed inset-0 z-40 flex md:hidden">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" on:click={toggleMobileMenu}></div>
        <div class={`relative flex w-full max-w-xs flex-1 flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} pt-5 pb-4`}>
          <div class="flex items-center justify-between px-4">
            <span class={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>E-Shop Admin</span>
            <button
              type="button"
              on:click={toggleMobileMenu}
              class={`ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset ${isDarkMode ? 'focus:ring-white' : 'focus:ring-indigo-500'}`}
            >
              <span class="sr-only">Close sidebar</span>
              <svg class={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-5 h-0 flex-1 overflow-y-auto">
            <nav class="space-y-1 px-2">
              {#each navigation as item}
                <a
                  href={item.href}
                  class={`group flex items-center px-2 py-2 text-base font-medium rounded-md 
                    ${$page.url.pathname === item.href ? 
                      (isDarkMode ? 'bg-gray-900 text-white' : 'bg-indigo-100 text-indigo-600') : 
                      (isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}`}
                >
                  <svg 
                    class={`mr-4 h-6 w-6 ${$page.url.pathname === item.href ? 
                      (isDarkMode ? 'text-white' : 'text-indigo-500') : 
                      (isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500')}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIconPath(item.icon)} />
                  </svg>
                  {item.name}
                </a>
              {/each}
            </nav>
          </div>
          <div class={`flex-shrink-0 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <button
              on:click={toggleDarkMode}
              class={`group mb-4 flex w-full items-center rounded-md py-2 px-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg 
                class={`mr-3 h-6 w-6 ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isDarkMode ? 
                  "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : 
                  "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
              </svg>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              on:click={logout}
              class={`group flex w-full items-center rounded-md py-2 px-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg class={`mr-4 h-6 w-6 ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    {/if}
    
   
    {#if breadcrumbItems.length > 0}
      <nav class={`${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`} aria-label="Breadcrumb">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-10 items-center">
            <ol class="flex items-center space-x-4">
              {#each breadcrumbItems as item, index}
                <li class="flex items-center">
                  {#if index > 0}
                    <svg class={`flex-shrink-0 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                  <a 
                    href={item.href} 
                    class={`ml-4 text-sm font-medium ${index === breadcrumbItems.length - 1 ? 
                      (isDarkMode ? 'text-white' : 'text-gray-800') : 
                      (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`} 
                    aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                </li>
              {/each}
            </ol>
          </div>
        </div>
      </nav>
    {/if}
    
    <main class="flex-1">
      <div class={`py-6 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'text-gray-100' : ''}`}>
        <slot />
      </div>
    </main>
  </div>
</div>

<script context="module" lang="ts">
  
  function getIconPath(icon: string): string {
    switch (icon) {
      case 'grid':
        return "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z";
      case 'package':
        return "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4";
      case 'shopping-cart':
        return "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z";
      case 'users':
        return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z";
      case 'bar-chart':
        return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
      case 'settings':
        return "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z";
      case 'info':
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'alert-triangle':
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
      case 'check-circle':
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'x-circle':
        return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'bell':
        return "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9";
      default:
        return "";
    }
  }
</script>

<style>

  :global(:root) {
    color-scheme: light;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  :global(.dark) {
    color-scheme: dark;
  }
  
  
  :global(.dark *:focus-visible) {
    outline-color: #6366f1;
  }
  
  
  .max-h-80 {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  .max-h-80::-webkit-scrollbar {
    width: 6px;
  }
  
  .max-h-80::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .max-h-80::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
</style>