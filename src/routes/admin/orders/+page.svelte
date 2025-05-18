<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Order {
    id: string;
    customerName: string;
    email: string;
    date: string;
    amount: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  }
  
  let orders: Order[] = [
    { id: 'ORD-001', customerName: 'John Brown', email: 'john@example.com', date: '2025-05-10', amount: '$149.99', status: 'Delivered' },
    { id: 'ORD-002', customerName: 'Emily Davis', email: 'emily@example.com', date: '2025-05-12', amount: '$89.50', status: 'Shipped' },
    { id: 'ORD-003', customerName: 'Michael Wilson', email: 'michael@example.com', date: '2025-05-14', amount: '$214.75', status: 'Processing' },
    { id: 'ORD-004', customerName: 'Sarah Miller', email: 'sarah@example.com', date: '2025-05-15', amount: '$76.25', status: 'Processing' },
    { id: 'ORD-005', customerName: 'David Taylor', email: 'david@example.com', date: '2025-05-09', amount: '$320.00', status: 'Delivered' },
    { id: 'ORD-006', customerName: 'Jennifer Garcia', email: 'jennifer@example.com', date: '2025-05-08', amount: '$56.75', status: 'Cancelled' },
    { id: 'ORD-007', customerName: 'Robert Martinez', email: 'robert@example.com', date: '2025-05-07', amount: '$129.99', status: 'Delivered' },
    { id: 'ORD-008', customerName: 'Jessica Rodriguez', email: 'jessica@example.com', date: '2025-05-06', amount: '$175.50', status: 'Shipped' },
    { id: 'ORD-009', customerName: 'Thomas Lee', email: 'thomas@example.com', date: '2025-05-05', amount: '$42.99', status: 'Delivered' },
    { id: 'ORD-010', customerName: 'Amanda White', email: 'amanda@example.com', date: '2025-05-04', amount: '$87.25', status: 'Delivered' }
  ];
  
  let searchQuery = '';
  let statusFilter = 'All';
  let filteredOrders: Order[] = [...orders];
  let sortField = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';
  let itemsPerPage = 5;
  let currentPage = 1;
  let totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  let selectedOrders: string[] = [];
  let isDeleteModalOpen = false;
  let isExportModalOpen = false;
  
  onMount(() => {
    // This would be where you fetch real data from your API
    fetchOrders();
  });
  
  async function fetchOrders() {
  
    try {
      
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
      const data = await response.json();
      orders = data.orders;
      updateFilteredOrders();
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }
  
  function updateFilteredOrders() {
    filteredOrders = orders.filter(order => {
      const matchesSearch = searchQuery === '' || 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    // Apply sorting
    filteredOrders = filteredOrders.sort((a, b) => {
      let valueA: any = a[sortField as keyof Order];
      let valueB: any = b[sortField as keyof Order];
      
      // Special handling for date
      if (sortField === 'date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      // Special handling for amount (remove $ and convert to number)
      if (sortField === 'amount') {
        valueA = parseFloat(valueA.replace('$', ''));
        valueB = parseFloat(valueB.replace('$', ''));
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages || 1;
    }
  }
  
  function handleSearch() {
    currentPage = 1;
    updateFilteredOrders();
  }
  
  function handleStatusFilter() {
    currentPage = 1;
    updateFilteredOrders();
  }
  
  function getStatusColor(status: string): string {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  async function updateOrderStatus(orderId: string, newStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') {
    // This is where you would normally update the status via your API
    try {
      // For this example, we'll just update it in our local array
      orders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      updateFilteredOrders();
      
     
      await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  }
  
  function handleSort(field: keyof Order) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
    updateFilteredOrders();
  }
  
  function getSortIcon(field: keyof Order) {
    if (sortField !== field) return 'text-gray-300';
    return sortDirection === 'asc' ? 'text-indigo-500 transform rotate-180' : 'text-indigo-500';
  }
  
  function getPaginatedOrders() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }
  
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
  
  function toggleOrderSelection(orderId: string) {
    if (selectedOrders.includes(orderId)) {
      selectedOrders = selectedOrders.filter(id => id !== orderId);
    } else {
      selectedOrders = [...selectedOrders, orderId];
    }
  }
  
  function toggleSelectAll() {
    if (selectedOrders.length === getPaginatedOrders().length) {
      selectedOrders = [];
    } else {
      selectedOrders = getPaginatedOrders().map(order => order.id);
    }
  }
  
  function openDeleteModal() {
    if (selectedOrders.length > 0) {
      isDeleteModalOpen = true;
    }
  }
  
  function closeDeleteModal() {
    isDeleteModalOpen = false;
  }
  
  function openExportModal() {
    if (filteredOrders.length > 0) {
      isExportModalOpen = true;
    }
  }
  
  function closeExportModal() {
    isExportModalOpen = false;
  }
  
  async function bulkDeleteOrders() {
    try {
      // For this example, we'll just update our local array
      orders = orders.filter(order => !selectedOrders.includes(order.id));
      updateFilteredOrders();
      selectedOrders = [];
      closeDeleteModal();
      
      
      await fetch('/api/admin/orders/bulk-delete', {
      method: 'DELETE',
       headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderIds: selectedOrders })
    });
    } catch (error) {
      console.error('Failed to delete orders:', error);
      alert('Failed to delete orders. Please try again.');
    }
  }
  
  function exportOrders(format: 'csv' | 'json') {
    // This would normally generate a file for download
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;
    
    if (format === 'csv') {
      // Generate CSV
      const headers = ['Order ID', 'Customer Name', 'Email', 'Date', 'Amount', 'Status'];
      const csvContent = [
        headers.join(','),
        ...ordersToExport.map(order => [
          order.id,
          `"${order.customerName}"`,
          order.email,
          order.date,
          order.amount,
          order.status
        ].join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
    } else if (format === 'json') {
      // Generate JSON
      const jsonContent = JSON.stringify(ordersToExport, null, 2);
      
      // Create download link
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.json`);
      a.click();
    }
    
    closeExportModal();
  }
  
  function addNewOrder() {
    // This would normally open a form or navigate to a form page
    alert('This would navigate to the order creation page in a real application.');
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
    <button 
      on:click={addNewOrder}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      New Order
    </button>
  </div>

  <div class="mt-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
      <div class="w-full md:w-1/3">
        <label for="search" class="sr-only">Search Orders</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            id="search"
            type="text"
            bind:value={searchQuery}
            on:input={handleSearch}
            placeholder="Search orders..."
            class="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div class="w-full md:w-1/4">
        <label for="status" class="sr-only">Status</label>
        <select
          id="status"
          bind:value={statusFilter}
          on:change={handleStatusFilter}
          class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      <div class="flex space-x-2">
        <button 
          on:click={openDeleteModal}
          disabled={selectedOrders.length === 0}
          class={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md ${selectedOrders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Delete
        </button>
        
        <button 
          on:click={openExportModal}
          disabled={filteredOrders.length === 0}
          class={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md ${filteredOrders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Export
        </button>
      </div>
    </div>
  </div>
  
  <div class="mt-8">
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <input
                type="checkbox"
                checked={selectedOrders.length === getPaginatedOrders().length && getPaginatedOrders().length > 0}
                on:change={toggleSelectAll}
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th 
              scope="col" 
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
              on:click={() => handleSort('id')}
            >
              <div class="flex items-center">
                Order ID
                <svg class={`ml-1 h-4 w-4 ${getSortIcon('id')}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              on:click={() => handleSort('customerName')}
            >
              <div class="flex items-center">
                Customer
                <svg class={`ml-1 h-4 w-4 ${getSortIcon('customerName')}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              on:click={() => handleSort('date')}
            >
              <div class="flex items-center">
                Date
                <svg class={`ml-1 h-4 w-4 ${getSortIcon('date')}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              on:click={() => handleSort('amount')}
            >
              <div class="flex items-center">
                Amount
                <svg class={`ml-1 h-4 w-4 ${getSortIcon('amount')}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each getPaginatedOrders() as order}
            <tr class={selectedOrders.includes(order.id) ? 'bg-indigo-50' : ''}>
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  on:change={() => toggleOrderSelection(order.id)}
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">{order.id}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div>{order.customerName}</div>
                <div class="text-xs text-gray-400">{order.email}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.amount}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <div class="flex items-center">
                  <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div class="ml-2 relative">
                    <select
                      value={order.status} 
                      on:change={(e) => updateOrderStatus(order.id, e.target.value)}
                      class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <a href={`/admin/orders/${order.id}`} class="text-indigo-600 hover:text-indigo-900">View</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    {#if filteredOrders.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
        <button
          on:click={() => { searchQuery = ''; statusFilter = 'All'; handleSearch(); }}
          class="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear filters
        </button>
      </div>
    {:else}
      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span class="font-medium">{filteredOrders.length}</span> orders
        </div>
        
        <div class="flex space-x-2">
          <button
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Previous
          </button>
          
          {#each Array(totalPages) as _, i}
            <button
              on:click={() => handlePageChange(i + 1)}
              class={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          {/each}
          
          <button
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Next
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>