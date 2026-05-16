<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Panel Administrativo - Sistema de Nóminas</title>

    <link rel="stylesheet" href="{{ asset('css/Sistema.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            margin: 0;
            padding: 0;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 280px;
            background: linear-gradient(180deg, var(--sidebar-bg) 0%, #10a87a 100%);
            color: #ffffff;
            display: flex;
            flex-direction: column;
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            z-index: 100;
        }

        .sidebar h3 {
            text-align: center;
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 0;
            padding: 30px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0,0,0,0.15);
        }

        #user-info {
            padding: 25px 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        #user-info p {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 12px 0;
            background: linear-gradient(90deg, #e0e7ff, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        #logout-btn {
            background-color: transparent;
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #fca5a5;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        #logout-btn:hover {
            background-color: var(--danger);
            color: white;
            border-color: var(--danger);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* ESTILO INTERNO: Botón de Seguridad en el Sidebar */
        #security-btn {
            background-color: transparent;
            border: 1px solid rgba(16, 168, 122, 0.6);
            color: #a7f3d0;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
        }

        #security-btn:hover {
            background-color: #10a87a;
            color: white;
            border-color: #10a87a;
            box-shadow: 0 4px 12px rgba(16, 168, 122, 0.4);
        }

        /* Navigation Links */
        #module-navigation {
            padding: 20px 15px 0 15px;
        }

        .nav-link {
            display: block;
            color: #c7d2fe;
            text-decoration: none;
            padding: 12px 18px;
            margin-bottom: 8px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            position: relative;
        }

        .nav-link:hover {
            background-color: var(--sidebar-hover);
            color: #ffffff;
            transform: translateX(4px);
        }

        .nav-link.active {
            background-color: var(--primary);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(7, 156, 120, 0.4);
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .main-content h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-main);
        }

        .content-box {
            background-color: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0,0,0,0.05);
            padding: 30px;
            flex: 1;
            border: 1px solid rgba(229, 231, 235, 0.5);
        }

        #content-header h4 {
            margin: 0 0 20px 0;
            font-size: 1.3rem;
            color: var(--text-main);
            font-weight: 600;
        }

        .fade-in {
            animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            color: var(--text-muted);
            font-weight: 500;
        }

        table { border-collapse: separate; border-spacing: 0; width: 100%; }
        th { background-color: #f9fafb !important; color: var(--text-muted) !important; font-weight: 600 !important; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; border: none !important; border-bottom: 2px solid #e5e7eb !important; }
        td { border: none !important; border-bottom: 1px solid #f3f4f6 !important; color: var(--text-main); font-size: 0.95rem; }
        tr:hover td { background-color: #f9fafb; }
        
        .primary {
            background-color: var(--primary) !important;
            color: white !important;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .primary:hover {
            background-color: var(--primary-hover) !important;
            box-shadow: 0 4px 12px rgba(7, 156, 120, 0.3) !important;
        }
    </style>
</head>
<body>
    <script>
        (function() {
            if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
            if(localStorage.getItem('density') === 'compact') document.body.classList.add('compact');
            const pc = localStorage.getItem('primaryColor') || 'charcoal';
            const cmap = {
                'charcoal': ['#333333', '#000000'],
                'steel': ['#4a5568', '#2d3748'],
                'stone': ['#718096', '#4a5568']
            };
            if(cmap[pc]) {
                document.body.style.setProperty('--primary', cmap[pc][0]);
                document.body.style.setProperty('--primary-hover', cmap[pc][1]);
            }
        })();
    </script>

    <div class="sidebar">
        <h3>Sistema de Nóminas</h3>
        <div id="user-info">
            <p id="username-display">{{ auth()->user()->name }}</p>
            
            <div id="user-actions-container" style="display: flex; gap: 8px; justify-content: center; align-items: center; width: 100%;">
                
                <a href="{{ route('seguridad.configurar.vista') }}" id="security-btn" style="flex: 1;">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Seguridad
                </a>

                <form action="{{ route('logout') }}" method="POST" style="margin: 0; flex: 1;">
                    @csrf
                    <button type="submit" id="logout-btn" style="padding: 8px 10px; font-size: 0.85rem;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Salir
                    </button>
                </form>
            </div>
        </div>
        <div id="module-navigation"></div>
        <div style="padding: 20px; text-align: center; padding-bottom: 25px;">
            <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 230px; max-width: 100%; height: auto; border-radius: 8px;" />
        </div>
    </div>

    <div class="main-content">
        <h1>Centro Administrativo</h1>
        
        <div class="content-box">
            <div id="content-header"></div>
            <div id="content-details"></div>
        </div>
    </div>

    <script src="{{ asset('js/Sistema.js') }}"></script>
    <script src="{{ asset('js/Admin.js') }}"></script>
    <script>
        window.laravelUser = {
            name: "{{ auth()->user()->name }}",
            role: "{{ auth()->user()->role }}"
        };
        window.userRole = "{{ auth()->user()->role }}";
    </script>
    <script>
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        });
    </script>
</body>
</html>