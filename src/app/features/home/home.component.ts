import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface JourneyStep {
  icon: string;
  title: string;
  description: string;
}

interface Service {
  icon: string;
  title: string;
  description: string;
  available: boolean;
}

interface Testimonial {
  name: string;
  duration: string;
  text: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface LegalBlock {
  heading: string;
  body?: string;
  items?: string[];
}

interface LegalSection {
  icon: string;
  title: string;
  subtitle: string;
  blocks: LegalBlock[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  mobileMenuOpen = false;
  activeTestimonial = 0;
  openFaqIndex: number | null = null;
  showInstructorModal = false;

  readonly features: Feature[] = [
    {
      icon: 'fa-users',
      title: 'دعم مستمر',
      description: 'رحلتك لا تنتهي بعد أول جلسة، بل نتابع تقدمك باستمرار.',
    },
    {
      icon: 'fa-bullseye',
      title: 'برنامج عملي',
      description: 'محاضرات مرتبة تساعدك على فهم الإدمان وكيفية التعافي خطوة بخطوة.',
    },
    {
      icon: 'fa-shield-halved',
      title: 'خصوصية تامة',
      description: 'جميع بياناتك ومعلوماتك الشخصية مشفرة وآمنة ولا يطلع عليها أي شخص.',
    },
  ];

  readonly goals: Feature[] = [
    {
      icon: 'fa-user',
      title: 'التوعية',
      description: 'رفع الوعي بأسباب الإدمان وكيفية التعامل معه بطريقة صحيحة.',
    },
    {
      icon: 'fa-heart',
      title: 'التعافي',
      description: 'تقديم برنامج عملي يساعد المشترك على التعافي التدريجي.',
    },
    {
      icon: 'fa-shield-halved',
      title: 'الخصوصية',
      description: 'بيئة آمنة وسرية تحافظ على بيانات جميع المشتركين.',
    },
    {
      icon: 'fa-rocket',
      title: 'الاستمرار',
      description: 'بناء متابعة ودعم يساعد على الاستمرار بعد التعافي.',
    },
  ];

  readonly journey: JourneyStep[] = [
    {
      icon: 'fa-user-plus',
      title: 'أنشئ حسابك',
      description: 'سجل بياناتك بسهولة وخصوصية تامة.',
    },
    {
      icon: 'fa-file-lines',
      title: 'اختر البرنامج',
      description: 'اختر البرنامج المناسب لك وابدأ رحلتك.',
    },
    {
      icon: 'fa-calendar-check',
      title: 'احجز الجلسة',
      description: 'احجز محاضرتك المفضلة وادفع بكل أمان.',
    },
    {
      icon: 'fa-circle-play',
      title: 'ابدأ المحاضرات',
      description: 'احضر المحاضرات واستفد من المحتوى العملي.',
    },
    {
      icon: 'fa-chart-line',
      title: 'واصل رحلتك',
      description: 'نساعدك على الاستمرار وتحقيق تقدم ثابت خطوة بخطوة.',
    },
  ];

  readonly services: Service[] = [
    {
      icon: 'fa-graduation-cap',
      title: 'برنامج التعافي مع وليد السيسي',
      description: '12 - 15 محاضرة',
      available: true,
    },
    {
      icon: 'fa-lock',
      title: 'قريبًا',
      description: 'خدمة جديدة بانتظارك',
      available: false,
    },
    {
      icon: 'fa-lock',
      title: 'قريبًا',
      description: 'خدمة جديدة بانتظارك',
      available: false,
    },
    {
      icon: 'fa-lock',
      title: 'قريبًا',
      description: 'خدمة جديدة بانتظارك',
      available: false,
    },
    {
      icon: 'fa-lock',
      title: 'قريبًا',
      description: 'خدمة جديدة بانتظارك',
      available: false,
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      name: 'يوسف ك.',
      duration: 'منذ 4 أشهر',
      text: 'الدعم والمتابعة هنا فرقوا معي في رحلتي للتعافي.',
    },
    {
      name: 'محمد ع.',
      duration: 'منذ شهرين',
      text: 'بدأت أستعيد ثقتي بنفسي بعد أول شهر من البرنامج.',
    },
    {
      name: 'أحمد م.',
      duration: 'منذ 3 أشهر',
      text: 'المحتوى كان عمليًا جدًا وساعدني على تغيير طريقة تفكيري.',
    },
  ];

  readonly faqs: Faq[] = [
    {
      question: 'هل المحاضرات مباشرة أم مسجلة؟',
      answer: 'تختلف طريقة التقديم حسب المحاضرة، وتظهر تفاصيلها كاملة قبل إتمام الحجز.',
    },
    {
      question: 'هل بياناتي آمنة؟',
      answer: 'نعم، نتعامل مع بياناتك بسرية تامة ولا نشاركها مع أي جهة غير مصرح لها.',
    },
    {
      question: 'هل البرنامج مناسب للجميع؟',
      answer: 'البرنامج تعليمي وداعم، وتختلف ملاءمته حسب حالة كل شخص واحتياجاته.',
    },
    {
  question: 'ماذا سأستفيد من البرنامج؟',
  answer: 'يساعدك البرنامج على فهم الإدمان، وتغيير أنماط التفكير، وبناء عادات صحية تدعم استمرارك في رحلة التعافي.',
},
    {
      question: 'كيفية إتمام الدفع؟',
      answer: 'بعد اختيار المحاضرة تنتقل إلى صفحة دفع آمنة لإتمام الحجز.',
    },
    {
      question: 'هل يمكنني إلغاء الحجز؟',
      answer: 'تطبق سياسة الإلغاء الموضحة أثناء الحجز بحسب موعد المحاضرة.',
    },
  ];

  readonly legalSections: LegalSection[] = [
    {
      icon: 'fa-user-shield',
      title: 'سياسة الخصوصية',
      subtitle: 'آخر تحديث: أغسطس 2026',
      blocks: [
        {
          heading: 'مرحبًا بك في Revive',
          body: 'نحن في Revive نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. وبما أن الموقع يدعم الأفراد في رحلة التعافي، فإننا ندرك أهمية السرية وأمان البيانات.',
        },
        {
          heading: 'المعلومات التي نجمعها',
          items: [
            'الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل.',
            'معلومات الملف الشخصي وتقدمك في رحلة التعافي.',
            'الرسائل والتفاعلات من خلال المنصة.',
            'معلومات الجهاز وإحصائيات استخدام الموقع.',
          ],
        },
        {
          heading: 'كيف نستخدم معلوماتك',
          items: [
            'إنشاء حسابك وإدارته وتخصيص تجربتك.',
            'حفظ تقدمك وإرسال التذكيرات والإشعارات.',
            'تحسين أداء المنصة وتقديم خدمات الدعم الفني.',
          ],
        },
        {
          heading: 'مشاركة البيانات',
          body: 'لا يقوم Revive ببيع أو تأجير أو المتاجرة بمعلوماتك الشخصية مع أي طرف ثالث. ولا نشارك البيانات إلا إذا كان ذلك مطلوبًا قانونيًا أو لتقديم الخدمة (مثل خوادم الاستضافة السحابية الآمنة).',
        },
        {
          heading: 'حقوق المستخدم',
          items: [
            'عرض وتحديث معلوماتك الشخصية في أي وقت.',
            'طلب حذف الحساب أو حذف البيانات المخزنة لدينا.',
          ],
        },
      ],
    },
    {
      icon: 'fa-shield-halved',
      title: 'الأمان وحماية البيانات',
      subtitle: 'ثقتك هي أولويتنا',
      blocks: [
        {
          heading: 'حماية معلوماتك',
          body: 'تم تصميم Revive مع مراعاة أعلى معايير الأمان للمساعدة في حماية معلوماتك الشخصية طوال رحلة التعافي.',
        },
        {
          heading: 'آليات الأمان المتبعة',
          items: [
            'تشفير البيانات أثناء النقل (SSL/TLS).',
            'استخدام طرق مصادقة آمنة وتشفير كلمات المرور.',
            'حصر الوصول للبيانات على الأنظمة المصرح لها فقط.',
            'تحديث بنية الأمان ومراقبة الأنظمة بانتظام.',
          ],
        },
        {
          heading: 'أمان الحساب والمسؤولية',
          items: [
            'اختر كلمة مرور قوية ولا تشارك بيانات دخولك.',
            'سجل الخروج عند استخدام الأجهزة المشتركة.',
            'تواصل معنا فورًا إذا شعرت بأي نشاط مشبوه.',
          ],
        },
      ],
    },
    {
      icon: 'fa-credit-card',
      title: 'الدفع والإلغاء والاسترداد',
      subtitle: 'الشروط المالية وسياسة الاسترجاع المعتمدة',
      blocks: [
        {
          heading: 'وسائل الدفع والعملة',
          items: [
            'نقبل الدفع عبر بطاقات الائتمان والخصم المباشر (Visa / Mastercard / Meeza).',
            'الدفع عبر المحافظ الإلكترونية والتطبيقات البنكية المعتمدة.',
            'جميع الأسعار والمعاملات تُحتسب بالجنيه المصري (EGP) وتتضمن كافة الرسوم.',
          ],
        },
        {
          heading: 'أمان المعاملات المالية',
          body: 'تتم جميع عمليات الدفع عبر بوابات دفع إلكترونية معتمدة ومشفرة بأعلى معايير الأمان (PCI-DSS & SSL). لا تقوم المنصة بتخزين أي بيانات لبطاقات الائتمان على خوادمها.',
        },
        {
          heading: 'سياسة الإلغاء (Cancellation Policy)',
          items: [
            'يحق للمستخدم إلغاء حجز الجلسة/المحاضرة قبل موعدها بـ 8 ساعات على الأقل من خلال حسابه على المنصة.',
            'في حالة طلب الإلغاء بعد المهلة المحددة (أقل من 8 ساعات) أو عدم الحضور، يعتبر الحجز مؤكداً وغير قابل للإلغاء.',
          ],
        },
        {
          heading: 'سياسة الاسترداد وإرجاع الأموال (Refund Policy)',
          items: [
            'عند إلغاء الحجز ضمن المهلة المحددة (قبل 8 ساعات من الموعد)، يتم رد المبلغ بالكامل.',
            'يتم رد الأموال المستردة إلى نفس وسيلة الدفع الأصلية المستخدمة في الشراء.',
            'تستغرق عملية إرجاع المبلغ من 7 إلى 14 يوم عمل حسب إجراءات البنك المصدر للبطاقة.',
          ],
        },
        {
          heading: 'تأكيد وتسليم الخدمة (Fulfillment & Delivery)',
          body: 'يتم تأكيد الحجز فوراً بعد نجاح عملية الدفع وإرسال إشعار وسند الدفع إلكترونياً، وتتاح الخدمة والجلسات في الموعد المحدد بالحجز عبر المنصة.',
        },
      ],
    },
    {
      icon: 'fa-file-signature',
      title: 'الشروط والأحكام',
      subtitle: 'باستخدامك Revive فإنك توافق على هذه الشروط',
      blocks: [
        {
          heading: 'شروط الاستخدام العامة',
          items: [
            'يهدف الموقع إلى دعم الأفراد خلال رحلة التعافي والإرشاد النفسي والتوعوي.',
            'Revive منصة توعوية وداهمة وليس بديلًا عن العلاج الطبي أو المستشفى النفسي في الحالات الطارئة.',
            'يتحمل المستخدم مسؤولية دقة البيانات التي يقدمها والحفاظ على سرية حسابه.',
            'قد يؤدي سوء استخدام المنصة أو محاولة تعطيلها إلى إيقاف الحساب فوراً.',
            'يحق لـ Revive تحديث الشروط والأحكام وتعديلها، واستمرار استخدام المنصة يعد موافقة عليها.',
          ],
        },
      ],
    },
  ];

  openInstructorModal(): void {
    this.showInstructorModal = true;
  }

  closeInstructorModal(): void {
    this.showInstructorModal = false;
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  nextTestimonial(): void {
    this.activeTestimonial =
      (this.activeTestimonial + 1) % this.testimonials.length;
  }

  previousTestimonial(): void {
    this.activeTestimonial =
      (this.activeTestimonial - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  setTestimonial(index: number): void {
    this.activeTestimonial = index;
  }
}