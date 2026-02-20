# backend/api/views.py
import requests
import json
import logging
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings

logger = logging.getLogger(__name__)

@csrf_exempt
def enrich_company(request):
    """
    Endpoint to enrich company data by fetching and analyzing their website
    """
    logger.info(f"--- Enrichment Request Started ---")
    logger.info(f"Method: {request.method}")
    logger.info(f"Path: {request.path}")
    logger.info(f"Origin: {request.META.get('HTTP_ORIGIN', 'No Origin')}")
    
    if request.method != 'POST':
        logger.warning(f"Invalid method: {request.method}")
        return JsonResponse({'error': f'Only POST method is allowed, got {request.method}'}, status=405)
    
    try:
        # Parse request body
        data = json.loads(request.body)
        url = data.get('url')
        logger.info(f"Received URL: {url}")
        
        if not url:
            logger.warning("URL missing in request body")
            return JsonResponse({'error': 'URL is required'}, status=400)
        
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        logger.info(f"Enriching company from URL: {url}")
        
        # Mock enrichment data based on URL
        mock_data = generate_mock_enrichment(url)
        logger.info("Enrichment successful")
        
        return JsonResponse(mock_data, status=200)
        
    except json.JSONDecodeError:
        logger.error("Failed to decode JSON body")
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Enrichment error: {str(e)}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

def generate_mock_enrichment(url):
    """Generate mock enrichment data based on URL patterns"""
    
    # Extract domain for some variation in responses
    domain = url.replace('https://', '').replace('http://', '').split('/')[0]
    
    # Different responses based on company type (just for demo variety)
    if 'ai' in domain or 'ml' in domain:
        summary = "AI-powered platform that leverages machine learning to automate complex business workflows and decision-making processes."
        bullets = [
            "Enterprise-grade AI platform for workflow automation",
            "Proprietary ML models trained on industry-specific data",
            "API-first architecture with seamless integrations",
            "Serving 50+ enterprise customers across finance and healthcare"
        ]
        keywords = ["artificial intelligence", "machine learning", "automation", "API", "enterprise", "SaaS", "B2B"]
        signals = [
            {"type": "hiring", "description": "15+ open positions across engineering and sales", "icon": "👥"},
            {"type": "blog", "description": "Recent blog post about AI trends in enterprise", "icon": "📝"},
            {"type": "funding", "description": "Raised $20M Series B in last 12 months", "icon": "💰"},
            {"type": "product", "description": "Launched new API v2 with real-time features", "icon": "🚀"}
        ]
    elif 'fin' in domain or 'pay' in domain or 'bank' in domain:
        summary = "Modern financial infrastructure platform enabling businesses to integrate banking, payments, and financial services through a single API."
        bullets = [
            "Unified API for banking, payments, and financial data",
            "Regulatory compliance built-in (GDPR, SOC2, PCI-DSS)",
            "Supports 50+ payment methods across 30+ countries",
            "Processing over $1B in transactions annually"
        ]
        keywords = ["fintech", "payments", "banking", "API", "compliance", "regtech", "B2B", "infrastructure"]
        signals = [
            {"type": "hiring", "description": "8+ open positions, mostly in compliance and engineering", "icon": "👥"},
            {"type": "partnership", "description": "Recently partnered with major European bank", "icon": "🤝"},
            {"type": "growth", "description": "Transaction volume up 150% YoY", "icon": "📈"},
        ]
    elif 'health' in domain or 'med' in domain or 'care' in domain:
        summary = "Digital health platform that connects patients with healthcare providers through telemedicine and AI-powered diagnostics."
        bullets = [
            "Telemedicine platform serving 500K+ patients",
            "AI-powered symptom checker with 95% accuracy",
            "Integration with major EHR systems",
            "Network of 2,000+ licensed healthcare providers"
        ]
        keywords = ["healthtech", "telemedicine", "healthcare", "AI", "patient care", "diagnostics", "HIPAA"]
        signals = [
            {"type": "hiring", "description": "Hiring for medical directors and engineers", "icon": "👥"},
            {"type": "regulatory", "description": "HIPAA compliant and FDA clearance pending", "icon": "⚖️"},
            {"type": "blog", "description": "Recent publication in medical journal", "icon": "📝"},
        ]
    else:
        summary = "Innovative SaaS platform that helps businesses streamline operations and drive growth through intelligent automation and data-driven insights."
        bullets = [
            "Cloud-based platform for business process automation",
            "Serves 1,000+ customers across 15 industries",
            "99.9% uptime SLA with enterprise-grade security",
            "Integrates with 50+ popular business tools"
        ]
        keywords = ["SaaS", "automation", "cloud", "B2B", "enterprise", "analytics", "workflow"]
        signals = [
            {"type": "hiring", "description": "12+ open positions in engineering and sales", "icon": "👥"},
            {"type": "blog", "description": "Weekly technical blog posts", "icon": "📝"},
            {"type": "customers", "description": "Added 50+ new customers this quarter", "icon": "🎯"},
        ]
    
    # Add sources
    sources = [
        {"url": url, "fetched_at": datetime.now().isoformat()},
        {"url": f"{url}/about", "fetched_at": datetime.now().isoformat()},
        {"url": f"{url}/careers", "fetched_at": datetime.now().isoformat()}
    ]
    
    return {
        "summary": summary,
        "bullets": bullets,
        "keywords": keywords,
        "signals": signals,
        "sources": sources
    }