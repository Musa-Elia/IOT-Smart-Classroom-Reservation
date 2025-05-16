   //****************MAP*************** */
   (() => {
      // Sample rooms data
      const rooms = [
        // Extension Building - Ground Floor
        {
          id: 'ext-a',
          building: 'Extension',
          floor: 'Ground Floor',
          name: 'Room A',
          status: 'available',
          capacity: 28,
          facilities: ['Projector', 'Whiteboard'],
        },
        {
          id: 'ext-b',
          building: 'Extension',
          floor: 'Ground Floor',
          name: 'Room B',
          status: 'occupied',
          capacity: 30,
          facilities: ['Smart Board'],
        },
        {
          id: 'ext-c',
          building: 'Extension',
          floor: 'Ground Floor',
          name: 'Room C',
          status: 'pending',
          capacity: 32,
          facilities: ['WiFi', 'AC'],
        },

        // Postgraduate Building - First Floor
        {
          id: 'pg-a',
          building: 'Postgraduate',
          floor: 'First Floor',
          name: 'Room D',
          status: 'available',
          capacity: 24,
          facilities: ['Projector'],
        },
        {
          id: 'pg-b',
          building: 'Postgraduate',
          floor: 'First Floor',
          name: 'Room E',
          status: 'occupied',
          capacity: 26,
          facilities: ['Whiteboard', 'WiFi'],
        },

        // Nyangumi Building - Second Floor
        {
          id: 'ny-a',
          building: 'Nyangumi',
          floor: 'Second Floor',
          name: 'Room F',
          status: 'available',
          capacity: 22,
          facilities: ['WiFi'],
        },
        {
          id: 'ny-b',
          building: 'Nyangumi',
          floor: 'Second Floor',
          name: 'Room G',
          status: 'pending',
          capacity: 20,
          facilities: ['Projector', 'AC'],
        },
        {
          id: 'ny-c',
          building: 'Nyangumi',
          floor: 'Second Floor',
          name: 'Room H',
          status: 'occupied',
          capacity: 25,
          facilities: ['Whiteboard'],
        },
      ];

      // Elements references
      const extensionRoomsContainer = document.getElementById('extensionRooms');
      const postgradRoomsContainer = document.getElementById('postgradRooms');
      const nyangumiRoomsContainer = document.getElementById('nyangumiRooms');
      const bookingOffcanvas = new bootstrap.Offcanvas(
        document.getElementById('bookingOffcanvas')
      );
      const bookingForm = document.getElementById('bookingForm');
      const roomNameInput = document.getElementById('roomName');
      const roomIdInput = document.getElementById('roomId');
      const bookerNameInput = document.getElementById('bookerName');
      const bookDateInput = document.getElementById('bookDate');
      const bookTimeInput = document.getElementById('bookTime');
      const searchInput = document.getElementById('searchRooms');
      const searchResults = document.getElementById('searchResults');

      // Initialize date min to today
      const todayDate = new Date().toISOString().split('T')[0];
      bookDateInput.min = todayDate;

      // Tooltip init function
      const initTooltips = () => {
        const tooltipTriggerList = document.querySelectorAll(
          '[data-bs-toggle="tooltip"]'
        );
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
          bootstrap.Tooltip.getInstance(tooltipTriggerEl)?.dispose();
          new bootstrap.Tooltip(tooltipTriggerEl);
        });
      };

      // Icon map by status
      const iconMap = {
        available: 'bi-door-open',
        occupied: 'bi-slash-circle',
        pending: 'bi-hourglass-split',
      };

      // Render rooms function
      function renderRooms() {
        // Clear containers
        extensionRoomsContainer.innerHTML = '';
        postgradRoomsContainer.innerHTML = '';
        nyangumiRoomsContainer.innerHTML = '';

        rooms.forEach((room) => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-4 col-6 mb-3';

          // Room card div
          const roomDiv = document.createElement('div');
          roomDiv.classList.add('room', room.status);
          roomDiv.setAttribute('tabindex', '0');
          roomDiv.setAttribute('role', 'button');
          roomDiv.setAttribute('aria-label', `${room.name}, status: ${room.status}`);

          // Tooltip content HTML
          const tooltipContent = `
            <b>Status:</b> ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}<br>
            <b>Capacity:</b> ${room.capacity}<br>
            <b>Facilities:</b> ${room.facilities.join(', ')}
          `;
          roomDiv.setAttribute('data-bs-toggle', 'tooltip');
          roomDiv.setAttribute('data-bs-html', 'true');
          roomDiv.setAttribute('title', tooltipContent);

          // Icon + name content
          roomDiv.innerHTML = `<i class="bi ${iconMap[room.status]} room-icon"></i> ${room.name}`;

          // Click behavior
          roomDiv.addEventListener('click', () => {
            if (room.status === 'occupied') {
              // Disabled booking - show tooltip only
              const tooltip = bootstrap.Tooltip.getInstance(roomDiv);
              tooltip?.hide();
              tooltip?.dispose();
              alert('Sorry, this room is currently occupied and cannot be booked.');
            } else if (room.status === 'pending') {
              alert(
                'This room is currently pending booking confirmation and cannot be booked now.'
              );
            } else if (room.status === 'available') {
              openBookingPanel(room);
            }
          });

          // Append room to appropriate building container
          if (room.building === 'Extension') {
            extensionRoomsContainer.appendChild(colDiv);
          } else if (room.building === 'Postgraduate') {
            postgradRoomsContainer.appendChild(colDiv);
          } else if (room.building === 'Nyangumi') {
            nyangumiRoomsContainer.appendChild(colDiv);
          }
          colDiv.appendChild(roomDiv);
        });

        initTooltips();
      }

      // Open booking offcanvas and populate room info
      function openBookingPanel(room) {
        roomNameInput.value = room.name;
        roomIdInput.value = room.id;
        bookerNameInput.value = '';
        bookDateInput.value = '';
        bookTimeInput.value = '';
        bookingOffcanvas.show();
      }

      // Booking form submit handler
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!bookingForm.checkValidity()) {
          bookingForm.classList.add('was-validated');
          return;
        }

        // You can add real backend logic here
        const bookedRoomId = roomIdInput.value;
        const bookedRoomIndex = rooms.findIndex((r) => r.id === bookedRoomId);

        if (bookedRoomIndex === -1) {
          alert('Room not found.');
          bookingOffcanvas.hide();
          return;
        }

        // Mark the room as pending booked on submit
        rooms[bookedRoomIndex].status = 'pending';

        alert(
          `Thank you, ${bookerNameInput.value}! You have successfully requested to book ${rooms[bookedRoomIndex].name} on ${bookDateInput.value} at ${bookTimeInput.value}.`
        );

        bookingOffcanvas.hide();
        renderRooms();
      });

      // Search logic
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
          searchResults.classList.remove('visible');
          searchResults.innerHTML = '';
          return;
        }

        // Filter rooms by name or status
        const filtered = rooms.filter((room) => {
          return (
            room.name.toLowerCase().includes(query) ||
            room.status.toLowerCase().includes(query)
          );
        });

        if (filtered.length === 0) {
          searchResults.innerHTML = '<div>No rooms found.</div>';
          searchResults.classList.add('visible');
          return;
        }

        // Show filtered results
        searchResults.innerHTML = filtered
          .map(
            (room) => `
          <div data-room-id="${room.id}" tabindex="0" role="button" aria-label="Select ${room.name}">
            <i class="bi ${iconMap[room.status]}" style="color:${
              room.status === 'available'
                ? 'var(--green)'
                : room.status === 'pending'
                ? 'var(--orange)'
                : 'var(--red)'
            }; margin-right: 8px; font-size: 1.2rem;"></i> ${room.name} - <small>${room.status}</small>
          </div>
        `
          )
          .join('');
        searchResults.classList.add('visible');

        // Add click listener to search results
        document.querySelectorAll('#searchResults div').forEach((el) => {
          el.addEventListener('click', () => {
            const id = el.getAttribute('data-room-id');
            const room = rooms.find((r) => r.id === id);
            if (room) {
              // Close search results
              searchResults.classList.remove('visible');
              searchInput.value = '';
              // Scroll & open accordion of building/floor then open booking or alert
              openBuildingAccordion(room.building);
              scrollToRoom(room.id);
              if (room.status === 'occupied') {
                alert('Sorry, this room is currently occupied and cannot be booked.');
              } else if (room.status === 'pending') {
                alert(
                  'This room is currently pending booking confirmation and cannot be booked now.'
                );
              } else {
                openBookingPanel(room);
              }
            }
          });
        });
      });

      // Close search results on outside click
      document.addEventListener('click', (e) => {
        if (
          !e.target.closest('.search-box') &&
          !e.target.closest('#searchResults')
        ) {
          searchResults.classList.remove('visible');
        }
      });

      // Scroll to room card by ID and focus
      function scrollToRoom(roomId) {
        const roomDiv = document.querySelector(`[data-room-id="${roomId}"]`);
        if (roomDiv) {
          roomDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
          roomDiv.focus();
        }
      }

      // Open accordion section for building
      function openBuildingAccordion(building) {
        const collapseEl = document.getElementById(`collapse${building}`);
        if (collapseEl && !collapseEl.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
          if (bsCollapse) {
            bsCollapse.show();
          } else {
            new bootstrap.Collapse(collapseEl, { toggle: true });
          }
        }
      }

      // Render initial rooms
      renderRooms();
    })();
