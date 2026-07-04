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
      title: 'تابع تقدمك',
      description: 'نرصد تقدمك ونساعدك على الاستمرار.',
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
      question: 'هل يمكنني التواصل مع المدرب؟',
      answer: 'تظهر وسائل المتابعة والتواصل المتاحة داخل تفاصيل البرنامج بعد التسجيل.',
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
      subtitle: 'آخر تحديث: يوليو 2026',
      blocks: [
        {
          heading: 'مرحبًا بك في Revive',
          body: 'نحن في Revive نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. وبما أن التطبيق يدعم الأفراد في رحلة التعافي، فإننا ندرك أهمية السرية وأمان البيانات.',
        },
        {
          heading: 'المعلومات التي نجمعها',
          items: [
            'الاسم، اختياريًا.',
            'عنوان البريد الإلكتروني.',
            'رقم الهاتف، إذا تم تقديمه.',
            'معلومات الملف الشخصي.',
            'تقدمك في رحلة التعافي والإنجازات.',
            'الرسائل المرسلة من خلال التطبيق.',
            'معلومات الجهاز.',
            'إحصائيات استخدام التطبيق.',
          ],
        },
        {
          heading: 'كيف نستخدم معلوماتك',
          items: [
            'إنشاء حسابك وإدارته.',
            'تخصيص تجربة التعافي الخاصة بك.',
            'حفظ تقدمك داخل التطبيق.',
            'إرسال التذكيرات والإشعارات.',
            'تحسين أداء التطبيق.',
            'تقديم الدعم وخدمة العملاء.',
          ],
        },
        {
          heading: 'مشاركة البيانات',
          body: 'لا يقوم Revive ببيع أو تأجير أو المتاجرة بمعلوماتك الشخصية. ولا نشارك المعلومات إلا إذا كان ذلك مطلوبًا قانونيًا، أو ضروريًا لتقديم الخدمة مثل الاستضافة السحابية الآمنة أو الإشعارات، أو بعد موافقتك الصريحة.',
        },
        {
          heading: 'أمان البيانات',
          body: 'نستخدم إجراءات أمان متوافقة مع معايير الصناعة لحماية بياناتك من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف.',
        },
        {
          heading: 'حقوقك',
          items: [
            'عرض بياناتك الشخصية.',
            'تحديث معلوماتك.',
            'حذف حسابك.',
            'طلب حذف بياناتك المخزنة.',
          ],
        },
        {
          heading: 'تنبيه طبي',
          body: 'Revive أداة داعمة للتعافي ولا يغني عن الاستشارة الطبية المتخصصة أو التشخيص أو العلاج. احرص دائمًا على طلب النصيحة من متخصصي الرعاية الصحية المؤهلين فيما يخص حالتك الصحية.',
        },
        {
          heading: 'التواصل',
          body: 'لأي أسئلة متعلقة بالخصوصية، يمكنك التواصل معنا من خلال قسم الدعم داخل التطبيق.',
        },
      ],
    },
    {
      icon: 'fa-shield-halved',
      title: 'الأمان',
      subtitle: 'ثقتك هي أولويتنا',
      blocks: [
        {
          heading: 'حماية معلوماتك',
          body: 'تم تصميم Revive مع مراعاة معايير الأمان للمساعدة في حماية معلوماتك الشخصية طوال رحلة التعافي.',
        },
        {
          heading: 'نحمي معلوماتك من خلال',
          items: [
            'تشفير البيانات أثناء نقلها.',
            'استخدام طرق مصادقة آمنة.',
            'حصر الوصول على الأنظمة المصرح لها فقط.',
            'تحديث بنية الأمان لدينا بانتظام.',
            'مراقبة الأنظمة لرصد أي أنشطة مشبوهة.',
          ],
        },
        {
          heading: 'أمان الحساب',
          items: [
            'اختر كلمة مرور قوية.',
            'لا تشارك بيانات تسجيل الدخول الخاصة بك.',
            'سجل الخروج من الأجهزة المشتركة.',
            'تواصل معنا فورًا إذا كنت تعتقد أن حسابك تعرض للاختراق.',
          ],
        },
        {
          heading: 'ملاحظة مهمة',
          body: 'على الرغم من أننا نعمل باستمرار على تحسين إجراءات الأمان، لا يمكن لأي خدمة إلكترونية ضمان الأمان بنسبة 100%. لذلك نشجع جميع المستخدمين على اتباع ممارسات أمان جيدة أثناء استخدام التطبيق.',
        },
      ],
    },
    {
      icon: 'fa-file-signature',
      title: 'الشروط والأحكام',
      subtitle: 'باستخدامك Revive فإنك توافق على هذه الشروط',
      blocks: [
        {
          heading: 'شروط الاستخدام',
          items: [
            'يهدف التطبيق إلى دعم الأفراد خلال رحلة التعافي.',
            'Revive ليس بديلًا عن العلاج الطبي أو النفسي.',
            'يتحمل المستخدم مسؤولية دقة المعلومات التي يقدمها.',
            'قد يؤدي سوء استخدام التطبيق أو محاولة تعطيل عمله إلى إيقاف الحساب.',
            'يبقى المستخدم مسؤولًا عن الحفاظ على سرية بيانات حسابه.',
            'يحتفظ Revive بالحق في تحديث أو تعديل هذه الشروط عند الحاجة، ويعد استمرار استخدام التطبيق قبولًا لأي تحديثات.',
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